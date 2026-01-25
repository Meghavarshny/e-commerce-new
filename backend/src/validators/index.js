const { z } = require("zod");

// Auth Schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["buyer", "seller"]).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Product Schemas
const productSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name is required"),
    description: z.string().optional(),
    price: z
      .number()
      .positive("Price must be positive")
      .or(
        z
          .string()
          .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
          .transform(Number),
      ),
    category: z.string().optional(),
    stock: z.number().int().min(0).optional().default(0),
    image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  }),
});

// Order Schemas
const orderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: z.string().min(1, "Product ID is required"),
          quantity: z.number().int().positive("Quantity must be positive"),
          price: z.number().positive("Price must be positive"),
        }),
      )
      .min(1, "Order must contain at least one item"),
    shippingInfo: z.object({
      address: z.string().min(5, "Address is too short"),
      city: z.string().min(2, "City is required"),
      postalCode: z.string().min(3, "Postal code is required"),
      country: z.string().min(2, "Country is required"),
    }),
    paymentInfo: z
      .object({
        method: z.string(),
        status: z.string(),
      })
      .optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  orderSchema,
};
