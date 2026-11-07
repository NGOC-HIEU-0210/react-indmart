import { z } from 'zod';

const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không quá 100 ký tự'),
  phone: z
    .string()
    .regex(phoneRegex, 'Số điện thoại không đúng định dạng (VD: 0912345678)'),
  email: z
    .string()
    .email('Địa chỉ email không hợp lệ'),
  address: z
    .string()
    .min(5, 'Địa chỉ giao hàng phải có ít nhất 5 ký tự')
    .max(255, 'Địa chỉ không quá 255 ký tự'),
  note: z
    .string()
    .max(500, 'Ghi chú không quá 500 ký tự')
    .optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER'], {
    required_error: 'Vui lòng chọn phương thức thanh toán',
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

