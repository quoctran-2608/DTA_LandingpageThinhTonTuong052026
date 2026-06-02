export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return json({ success: false, message: "Yêu cầu không hợp lệ." }, 400);
    }

    const body = await request.json();

    const name = clean(body["ho-ten"]);
    const phone = clean(body["so-dien-thoai"]);
    const spaceType = clean(body["loai-hinh-khong-gian"]);
    const province = clean(body["khu-vuc"]);
    const newProvince = clean(body["khu-vuc-moi"]);
    const message = clean(body["noi-dung"]);
    const token = clean(body["cf-turnstile-response"]);

    if (!name || name.length < 2) {
      return json({ success: false, message: "Vui lòng nhập họ và tên hợp lệ." }, 400);
    }

    if (!phone || !isVietnamPhone(phone)) {
      return json({ success: false, message: "Vui lòng nhập số điện thoại Việt Nam hợp lệ." }, 400);
    }

    if (!spaceType || !province || !message || message.length < 10) {
      return json({ success: false, message: "Vui lòng nhập đầy đủ loại hình, khu vực và nội dung tâm nguyện." }, 400);
    }

    if (!token) {
      return json({ success: false, message: "Vui lòng xác minh bảo mật trước khi gửi." }, 400);
    }

    const captchaOK = await verifyTurnstile({
      token,
      secret: env.TURNSTILE_SECRET_KEY,
      ip: request.headers.get("CF-Connecting-IP")
    });

    if (!captchaOK) {
      return json({ success: false, message: "Xác minh bảo mật thất bại. Vui lòng thử lại." }, 403);
    }

    const sourceOrigin = clean(request.headers.get("origin") || "Website");
    const submittedAt = new Date().toISOString();
    const leadId = `DTA-${Date.now().toString(36).toUpperCase()}`;

    // Deliverability-friendly email:
    // - Có bản text thuần để Gmail hiểu đây là thông báo giao dịch/nội bộ.
    // - HTML cực đơn giản, không banner, không nút CTA, không màu mè như email marketing.
    // - Subject cố định, không nhúng nội dung người dùng để tránh trigger spam.
    const textEmail = [
      "Form tư vấn mới - Diệu Tướng Am",
      "",
      `Mã hồ sơ: ${leadId}`,
      `Thời gian gửi: ${submittedAt}`,
      `Họ và tên: ${name}`,
      `Số điện thoại: ${phone}`,
      `Loại hình không gian: ${spaceType}`,
      `Khu vực: ${province}`,
      `Tỉnh/thành theo mapping mới: ${newProvince || province}`,
      "",
      "Nội dung:",
      message,
      "",
      `Nguồn: ${sourceOrigin}`
    ].join("\n");

    const html = `
      <p>Form tư vấn mới - Diệu Tướng Am</p>
      <p><strong>Mã hồ sơ:</strong> ${escapeHtml(leadId)}</p>
      <p><strong>Thời gian gửi:</strong> ${escapeHtml(submittedAt)}</p>
      <p><strong>Họ và tên:</strong> ${escapeHtml(name)}</p>
      <p><strong>Số điện thoại:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Loại hình không gian:</strong> ${escapeHtml(spaceType)}</p>
      <p><strong>Khu vực:</strong> ${escapeHtml(province)}</p>
      <p><strong>Tỉnh/thành theo mapping mới:</strong> ${escapeHtml(newProvince || province)}</p>
      <p><strong>Nội dung:</strong></p>
      <p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
      <p><strong>Nguồn:</strong> ${escapeHtml(sourceOrigin)}</p>
    `;

    const emailPayload = {
      from: env.FROM_EMAIL,
      to: [env.TO_EMAIL],
      subject: "Form tư vấn mới - Diệu Tướng Am",
      text: textEmail,
      html,
      reply_to: env.REPLY_TO_EMAIL || undefined,
      headers: {
        "X-Entity-Ref-ID": leadId
      }
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailPayload)
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Resend error:", detail);
      return json({ success: false, message: "Hệ thống chưa gửi được email. Vui lòng thử lại sau." }, 502);
    }

    return json({
      success: true,
      message: "Cảm ơn bạn. Diệu Tướng Am đã nhận được tâm nguyện và sẽ liên hệ lại sớm."
    });

  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Có lỗi hệ thống. Vui lòng thử lại sau." }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(context.request)
    });
  }

  return json({ success: false, message: "Method not allowed." }, 405, context.request);
}

async function verifyTurnstile({ token, secret, ip }) {
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData
  });

  const result = await response.json();
  return Boolean(result.success);
}

function isVietnamPhone(value) {
  const phone = String(value || "").replace(/[\s().-]/g, "");
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(phone);
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function json(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(request ? corsHeaders(request) : {})
    }
  });
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = [
    "https://thietkekhonggianphongtho.dieutuongam.com",
    "https://dta-cloudflare-form-source.pages.dev"
  ];

  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : "https://thietkekhonggianphongtho.dieutuongam.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
