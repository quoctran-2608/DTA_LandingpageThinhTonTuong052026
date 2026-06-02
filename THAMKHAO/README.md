# Diệu Tướng Am – Assets section Tôn Tượng Phật Bổn Sư

Bộ asset này đã được phân loại theo cấu trúc phù hợp với source `index.html/index(54).html`.

## Cách dùng khuyến nghị

- Section mới nên nối ngay sau `intro-section#gioi-thieu`.
- Ảnh `visual-bon-su-composite.png` là ảnh composite chính, giữ nguyên tượng Phật, hào quang, mây và hoa sen trong cùng một ảnh. Không cần tách tượng/hoa sen khỏi nền.
- Text, heading, mô tả và 3 card nên dựng bằng HTML/CSS để responsive tốt.
- 3 icon card nằm trong `assets/icons/ton-tuong/`.
- Các khung card nằm trong `assets/images/decor/ton-tuong/`; có nhiều biến thể ngang/dọc để chọn theo desktop/mobile.
- Nền section nằm trong `assets/images/bg/bg-ton-tuong-parchment.png`.

## Gợi ý dùng responsive

Desktop:
- Bố cục 2 cột: copy/cards bên trái, visual composite bên phải.
- Card có thể dùng CSS border là chính; nếu cần đúng phong cách ảnh mẫu, dùng `card-frame-vertical-classic.png` hoặc `card-frame-square-floral.png`.

Mobile:
- Thứ tự nên là: lotus mark → heading → divider → visual composite → mô tả → 3 card.
- Card nên xếp 1 cột; dùng icon trái, chữ phải.
- Nếu dùng frame ảnh, chọn `card-frame-mobile-horizontal.png` hoặc dựng border bằng CSS để linh hoạt hơn.

## Danh sách file

- `assets/images/decor/ton-tuong/card-frame-landscape-soft.png` — 1672x941px — Khung card ngang nhẹ, phù hợp desktop hoặc card rộng.
- `assets/images/decor/ton-tuong/card-frame-landscape-classic.png` — 1672x941px — Khung card ngang cổ điển, phù hợp desktop/card rộng.
- `assets/images/decor/ton-tuong/card-frame-mobile-horizontal.png` — 1672x941px — Khung card ngang tối ưu cho mobile khi icon trái, chữ phải.
- `assets/images/decor/ton-tuong/card-frame-square-floral.png` — 1086x1448px — Khung vuông/đứng, có hoa văn góc, dùng khi muốn card cao.
- `assets/images/decor/ton-tuong/card-frame-mobile-vertical.png` — 1086x1448px — Khung dọc tối ưu mobile dạng card đứng.
- `assets/images/decor/ton-tuong/card-frame-vertical-classic.png` — 1086x1448px — Khung dọc cổ điển, gần phong cách 3 card trong ảnh desktop.
- `assets/icons/ton-tuong/icon-chuan-tuong.png` — 1448x1086px — Icon card Chuẩn tướng.
- `assets/icons/ton-tuong/icon-che-tac.png` — 1448x1086px — Icon card Chuẩn mực chế tác.
- `assets/icons/ton-tuong/icon-an-vi.png` — 2048x682px — Icon card An vị trang nghiêm.
- `assets/images/decor/ton-tuong/decor-heading-lotus.png` — 1254x1254px — Icon hoa sen phía trên tiêu đề.
- `assets/images/decor/ton-tuong/decor-divider-lotus.png` — 1254x1254px — Divider hoa văn mảnh dưới tiêu đề.
- `assets/images/decor/ton-tuong/decor-flower-line-top-left.png` — 1254x1254px — Hoa sen nét vàng trang trí góc trái trên.
- `assets/images/decor/ton-tuong/decor-flower-line-top-right.png` — 1254x1254px — Hoa sen nét vàng trang trí góc phải trên.
- `assets/images/ton-tuong/visual-bon-su-composite.png` — 1122x1402px — Ảnh composite chính gồm tượng Phật, hào quang, mây và hoa sen. Không tách nhân vật/đối tượng ra khỏi nền.
- `assets/images/bg/bg-ton-tuong-parchment.png` — 1672x941px — Nền section full-width. Dùng cho .bon-su-meaning-section background.
