# IND MART - CỬA HÀNG RAU CỦ QUẢ TƯƠI SẠCH

Ứng dụng web Frontend thương mại điện tử chuyên cung cấp nông sản, rau củ quả tươi sạch kết nối với hệ thống Backend Spring Boot và xác thực người dùng qua Keycloak.

---

## 1. CÔNG NGHỆ SỬ DỤNG

- **Nền tảng**: Vite 5 + React 18 + TypeScript (chế độ `strict: true`)
- **Cổng phát triển**: Port `3000` (`strictPort: true`)
- **Quản lý Server State & Caching**: `@tanstack/react-query` v5
- **Điều hướng & Lazy Loading**: `react-router-dom` v6 (Data Router, Code-splitting từng route)
- **HTTP Client**: `axios` (Interceptor tự động cập nhật token Keycloak, gắn Bearer token, bắt mã lỗi 429 Retry-After, thông báo lỗi từ backend)
- **Xác thực & Phân quyền**: `keycloak-js` (Chuẩn PKCE `S256`, `checkLoginIframe: false`, chế độ `check-sso` cho phép khách vãng lai xem hàng)
- **Quản lý Form & Xác thực dữ liệu**: `react-hook-form` + `zod`
- **Giao diện & Styling**: Tailwind CSS, `clsx` (Tối giản, phong cách xanh lá dịu mát mắt cho nông sản, không shadow đậm, viền mảnh)
- **Biểu đồ Dashboard**: `recharts` (BarChart thống kê trạng thái đơn hàng)
- **Xử lý ngày tháng**: `dayjs` (Định dạng chuẩn `DD/MM/YYYY` và `DD/MM/YYYY HH:mm`)
- **Thông báo Toast**: `react-hot-toast`
- **Biểu tượng (Icon)**: `lucide-react` (Được kiểm soát chặt chẽ, chỉ dùng ở giỏ hàng, tìm kiếm, yêu thích và menu tài khoản; không lạm dụng icon ở nút hành động và sidebar admin)

---

## 2. KIẾN TRÚC THƯ MỤC DỰ ÁN

Dự án được tổ chức theo kiến trúc **Component-Based chia theo Feature**:

```
src/
├── app/
│   ├── App.tsx                    # Root component bọc ErrorBoundary & Providers
│   ├── router.tsx                 # Cấu hình React Router v6 Data Router, lazy loading
│   └── providers/
│       ├── AuthContext.tsx        # Quản lý phiên Keycloak, useAuth hook
│       ├── QueryClientProvider.tsx# Cấu hình TanStack Query
│       └── ToastProvider.tsx      # Cấu hình react-hot-toast
├── lib/
│   ├── axios.ts                   # Axios instance, Interceptors xử lý token & mã 429
│   ├── keycloak.ts                # Khởi tạo đối tượng Keycloak
│   ├── format.ts                  # Hàm format tiền tệ VND (35.000 ₫) và ngày tháng
│   └── imageUrl.ts                # Xử lý URL ảnh từ backend, ảnh SVG dự phòng
├── types/
│   └── index.ts                   # Khai báo kiểu TypeScript: ApiResponse, PageResponse, models
├── components/
│   ├── ui/                        # Bộ UI cơ bản dùng chung
│   │   ├── Button.tsx             # Hỗ trợ isLoading="Đang xử lý...", chống double click
│   │   ├── Input.tsx, Textarea.tsx, Select.tsx, Checkbox.tsx, Switch.tsx
│   │   ├── Modal.tsx              # Hộp thoại modal, truy cập phím Esc
│   │   ├── ConfirmDialog.tsx      # Hộp thoại xác nhận cho mọi thao tác xoá/huỷ
│   │   ├── Table.tsx              # Bảng dữ liệu tự động cuộn ngang trên mobile
│   │   ├── Pagination.tsx         # Phân trang, tự động cuộn lên đầu danh sách
│   │   ├── Badge.tsx, Tabs.tsx, Spinner.tsx, Skeleton.tsx
│   │   ├── EmptyState.tsx         # Trạng thái danh sách rỗng
│   │   ├── ErrorState.tsx         # Trạng thái lỗi mạng / server kèm nút "Thử lại"
│   │   └── Card.tsx, FormField.tsx
│   └── common/                    # Component nghiệp vụ dùng chung
│       ├── ProductCard.tsx        # Thẻ sản phẩm vuông, nhãn giảm giá, nút tim yêu thích
│       ├── PriceTag.tsx           # Giá bán, giá gốc gạch ngang, nhãn phần trăm giảm
│       ├── QuantityStepper.tsx    # Tăng/giảm số lượng, chặn số âm hoặc 0
│       ├── SearchBox.tsx          # Ô tìm kiếm có icon
│       ├── StatusBadge.tsx        # Nhãn trạng thái đơn hàng, thanh toán, lô hàng
│       ├── ImageWithFallback.tsx  # Tự động thay thế ảnh lỗi bằng ảnh dự phòng
│       ├── ImageUploader.tsx      # Kéo thả & chọn file ảnh, xem trước, xoá
│       ├── PageHeader.tsx         # Tiêu đề trang, breadcrumb, nút hành động
│       └── ErrorBoundary.tsx      # Bắt lỗi crash runtime cấp ứng dụng
├── layouts/
│   ├── PublicLayout.tsx           # Header có tìm kiếm, Giỏ[N], menu tài khoản, Footer
│   ├── AccountLayout.tsx          # Menu dọc bên trái cho các trang cá nhân
│   ├── AdminLayout.tsx            # Header admin, Sidebar chỉ chữ, hỗ trợ mobile menu
│   └── AuthLayout.tsx             # Thẻ giữa màn hình trên nền xám nhạt
├── routes/
│   ├── ProtectedRoute.tsx         # Kiểm tra đăng nhập, ghi nhớ trang cần chuyển tiếp
│   └── AdminRoute.tsx             # Kiểm tra quyền ADMIN trong realm_access.roles
├── features/                      # Mỗi feature gồm api, hooks, components, schemas
│   ├── categories/                # Quản lý danh mục sản phẩm
│   ├── products/                  # Quản lý sản phẩm, lưới sản phẩm, bộ lọc, thư viện ảnh
│   ├── favourites/                # Danh sách và chức năng bật/tắt yêu thích
│   ├── cart/                      # Quản lý giỏ hàng, debounce cập nhật số lượng
│   ├── coupons/                   # Áp dụng và quản lý mã giảm giá
│   ├── orders/                    # Đặt hàng, theo dõi tracking, duyệt đơn
│   ├── profile/                   # Hồ sơ người dùng, cập nhật thông tin & avatar
│   ├── admin-dashboard/           # Thống kê số liệu, doanh thu & biểu đồ
│   ├── inventory/                 # Quản lý lô hàng, hàng sắp hết hạn, báo cáo hao hụt
│   └── users/                     # Quản trị tài khoản người dùng
└── pages/                         # Ghép các component và hooks
    ├── public/                    # HomePage, CategoriesPage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, CheckoutSuccessPage, 404, 403
    ├── account/                   # ProfilePage, OrdersPage, OrderDetailPage, FavouritesPage, CouponsPage
    ├── admin/                     # AdminDashboardPage, AdminProductsPage, AdminCategoriesPage, AdminCouponsPage, AdminOrdersPage, AdminOrderDetailPage, AdminInventoryPage, AdminUsersPage
    └── auth/                      # LoginPage, RegisterPage, ForgotPasswordPage
```

---

## 3. HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### Bước 1: Cài đặt dependencies
Tại thư mục `reactJS/my-app`:
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
Kiểm tra hoặc tạo tệp `.env` trong thư mục `reactJS/my-app` (đã có tệp mẫu `.env.example`):
```env
VITE_API_URL=http://localhost:9090
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=indmart
VITE_KEYCLOAK_CLIENT_ID=indmart-web
```

### Bước 3: Khởi chạy môi trường phát triển
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: **`http://localhost:3000`**

### Bước 4: Kiểm tra biên dịch sản xuất (Production Build)
```bash
npm run build
```
Lệnh sẽ chạy TypeScript kiểm tra kiểu nghiêm ngặt (`tsc`) và đóng gói mã nguồn tối ưu với `vite build`.

---

## 4. HƯỚNG DẪN CHẠY BACKEND & KEYCLOAK

### Khởi chạy qua Docker Compose
Tại thư mục gốc của dự án (`Web-Ind-mart-main`), chạy lệnh:
```bash
docker-compose up -d
```
Lệnh trên sẽ khởi chạy 3 container:
1. **`indmart-mysql`**: Cơ sở dữ liệu MySQL 8.4
2. **`indmart-keycloak`**: Cổng `8080`, tự động import realm `indmart` từ `./docker/keycloak/`
3. **`indmart-app`**: Backend Spring Boot chạy tại cổng `9090`

### Tài khoản thử nghiệm
- **Tài khoản Quản trị viên (Admin)**:
  - Tên đăng nhập: `admin`
  - Mật khẩu: `Admin@123`
  - *(Lưu ý: Nếu Keycloak yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên, vui lòng làm theo hướng dẫn trên màn hình Keycloak)*.
- **Tài khoản Khách hàng**:
  - Người dùng có thể nhấn **Đăng ký** trực tiếp trên website để tạo tài khoản mới qua Keycloak.

---

## 5. BẢNG PHÂN QUYỀN VÀ DANH SÁCH ROUTE

| Đường dẫn | Quyền truy cập | Chức năng chính |
|---|---|---|
| `/` | Công khai | Trang chủ: Banner, Giải cứu hôm nay, Danh mục nổi bật, Sản phẩm mới |
| `/categories` | Công khai | Danh sách danh mục sản phẩm |
| `/products` | Công khai | Tìm kiếm sản phẩm, lọc theo danh mục, phân trang |
| `/products/:id` | Công khai | Chi tiết sản phẩm, thư viện ảnh thumbnail, chọn số lượng, Thêm vào giỏ, Mua ngay |
| `/login` | Công khai | Đăng nhập an toàn qua Keycloak, chuyển tiếp đúng vai trò |
| `/register` | Công khai | Đăng ký tài khoản mới qua Keycloak |
| `/forgot-password` | Công khai | Hướng dẫn đặt lại mật khẩu |
| `/cart` | Đăng nhập | Giỏ hàng, sửa số lượng (debounce), xoá món, nhập mã coupon, tính tiền |
| `/checkout` | Đăng nhập | Điền thông tin giao hàng (tự động điền từ hồ sơ), chọn COD / Chuyển khoản |
| `/checkout/success/:orderCode` | Đăng nhập | Thông báo đặt hàng thành công, hiển thị mã đơn và tổng tiền |
| `/account/profile` | Đăng nhập | Xem và sửa thông tin cá nhân, cập nhật ảnh đại diện |
| `/account/orders` | Đăng nhập | Danh sách đơn hàng theo tabs trạng thái |
| `/account/orders/:id` | Đăng nhập | Chi tiết đơn, dòng thời gian tracking, huỷ đơn (khi đơn PENDING & UNPAID) |
| `/account/favourites` | Đăng nhập | Danh sách sản phẩm yêu thích, nút bỏ yêu thích |
| `/account/coupons` | Đăng nhập | Danh sách mã giảm giá đang hoạt động, nút sao chép mã |
| `/admin` | ADMIN | Tổng quan doanh thu, số liệu đơn hàng, biểu đồ Recharts, cảnh báo hết hạn |
| `/admin/products` | ADMIN | Quản lý sản phẩm, thêm/sửa modal, upload ảnh chính & ảnh phụ, xoá |
| `/admin/categories` | ADMIN | Quản lý danh mục cha/con, thêm/sửa modal, upload ảnh đại diện, xoá |
| `/admin/coupons` | ADMIN | Quản lý mã giảm giá, thêm/sửa modal (loại % hoặc tiền mặt, thời hạn, giới hạn) |
| `/admin/orders` | ADMIN | Tìm kiếm đơn theo từ khoá/trạng thái, duyệt đơn |
| `/admin/orders/:id` | ADMIN | Chi tiết đơn hàng, đổi trạng thái đơn, đổi trạng thái thanh toán, xoá đơn |
| `/admin/inventory` | ADMIN | Quản lý kho 3 tabs: Theo sản phẩm, Lô sắp hết hạn, Báo cáo hao hụt, nhập lô mới, xuất huỷ |
| `/admin/users` | ADMIN | Quản lý người dùng, tìm kiếm, tạo mới/sửa, switch khoá tài khoản, bảo vệ không cho tự khoá/xoá chính mình |
| `/403` | Công khai | Trang thông báo không có quyền truy cập |
| `/404` | Công khai | Trang thông báo không tìm thấy đường dẫn |

---

## 6. CÁC QUY CHUẨN CHẤT LƯỢNG ĐÃ ĐẢM BẢO

1. **Trạng thái giao diện**: Mọi danh sách dữ liệu đều hiển thị đầy đủ 3 trạng thái:
   - Đang tải: Hiệu ứng `Skeleton` hoặc `Spinner`
   - Trống: Thành phần `EmptyState` kèm mô tả và nút điều hướng
   - Lỗi: Thành phần `ErrorState` kèm nút "Thử lại" và tự nhận diện khi mất kết nối mạng.
2. **Tránh click đúp**: Tất cả các nút gửi form, mutation đều có trạng thái `isLoading="Đang xử lý..."` và tự động disabled.
3. **Xác thực dữ liệu chặt chẽ**:
   - Client validate bằng `Zod`: Số lượng nguyên $\ge 1$, số điện thoại Việt Nam hợp lệ, định dạng Email chuẩn, địa chỉ và tên người nhận.
4. **Định dạng chuẩn Việt Nam**:
   - Tiền tệ: `Intl.NumberFormat('vi-VN')` hiển thị dạng `35.000 ₫`.
   - Ngày tháng: Chuẩn `DD/MM/YYYY` hoặc `DD/MM/YYYY HH:mm`.
5. **An toàn dữ liệu**: Mọi hành động nhạy cảm (xoá sản phẩm, xoá danh mục, xoá coupon, xoá người dùng, huỷ đơn hàng, xuất huỷ kho) đều bắt buộc đi qua hộp thoại `ConfirmDialog`.
6. **Bảo vệ tài khoản quản trị**: Trên giao diện quản lý người dùng, tài khoản của chính Admin đang đăng nhập sẽ ẩn công tắc khoá và nút xoá, ngăn ngừa lỗi tự vô hiệu hoá tài khoản của chính mình.
7. **Bảo mật**: Không bao giờ ghi `token` ra console trình duyệt.
# react-indmart
