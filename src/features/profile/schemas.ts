import { z } from 'zod';

const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

export const profileSchema = z.object({
  firstName: z
    .string()
    .max(50, 'Họ đệm không quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(1, 'Tên không được bỏ trống')
    .max(50, 'Tên không quá 50 ký tự'),
  mobile: z
    .string()
    .regex(phoneRegex, 'Số điện thoại không đúng định dạng')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(255, 'Địa chỉ không quá 255 ký tự')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

