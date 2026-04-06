// src/lib/email.ts
import nodemailer from 'nodemailer';
import { IOrder } from '@/types';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Silk Drapes</title>
</head>
<body style="margin:0;padding:0;background:#fdf8f3;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f3;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#8B1A4A 0%,#C0426E 50%,#E8769F 100%);padding:40px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:4px;font-weight:400;">SILK DRAPES</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:2px;">PREMIUM SAREE COLLECTION</p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:40px 32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fdf8f3;padding:24px 32px;text-align:center;border-top:1px solid #f0e8e0;">
            <p style="margin:0;color:#9e7b8a;font-size:12px;">© 2025 Silk Drapes. All rights reserved.</p>
            <p style="margin:8px 0 0;color:#b89aa8;font-size:11px;">Questions? Email us at ${process.env.ADMIN_EMAIL}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const statusConfig: Record<string, { color: string; icon: string; title: string }> = {
  pending: { color: '#F59E0B', icon: '⏳', title: 'Order Placed' },
  payment_received: { color: '#10B981', icon: '✅', title: 'Payment Received' },
  confirmed: { color: '#3B82F6', icon: '🎉', title: 'Order Confirmed' },
  processing: { color: '#6366F1', icon: '⚙️', title: 'Processing Your Order' },
  shipped: { color: '#8B5CF6', icon: '📦', title: 'Order Shipped' },
  out_for_delivery: { color: '#EC4899', icon: '🛵', title: 'Out for Delivery' },
  delivered: { color: '#059669', icon: '🎊', title: 'Order Delivered' },
  return_requested: { color: '#F97316', icon: '↩️', title: 'Return Requested' },
  return_approved: { color: '#06B6D4', icon: '✔️', title: 'Return Approved' },
  returned: { color: '#6B7280', icon: '🔄', title: 'Order Returned' },
  cancelled: { color: '#EF4444', icon: '❌', title: 'Order Cancelled' },
};

export async function sendOrderEmail(
  to: string,
  customerName: string,
  order: Partial<IOrder>,
  status: string,
  extraMessage?: string
) {
  const cfg = statusConfig[status] || { color: '#8B1A4A', icon: '📧', title: 'Order Update' };

  const itemsHtml = order.items
    ?.map(
      (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0e8e0;">
        <table width="100%">
          <tr>
            <td width="60"><img src="${item.image}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;"></td>
            <td style="padding-left:12px;">
              <p style="margin:0;font-size:14px;color:#3d1a2a;font-weight:600;">${item.name}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#9e7b8a;">Qty: ${item.quantity}</p>
            </td>
            <td align="right"><p style="margin:0;font-size:14px;color:#3d1a2a;font-weight:600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p></td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join('');

  const content = `
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:64px;height:64px;background:${cfg.color}15;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;">${cfg.icon}</div>
      <h2 style="margin:0;font-size:24px;color:#3d1a2a;">${cfg.title}</h2>
      <p style="margin:8px 0 0;color:#9e7b8a;font-size:14px;">Hello ${customerName}, here's your order update.</p>
    </div>

    <div style="background:#fdf8f3;border-radius:12px;padding:20px;margin-bottom:24px;">
      <table width="100%">
        <tr>
          <td><p style="margin:0;font-size:12px;color:#9e7b8a;text-transform:uppercase;letter-spacing:1px;">Order Number</p>
          <p style="margin:4px 0 0;font-size:16px;color:#3d1a2a;font-weight:700;">#${order.orderNumber}</p></td>
          <td align="right">
            <span style="background:${cfg.color};color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;">${status.replace(/_/g, ' ')}</span>
          </td>
        </tr>
      </table>
    </div>

    ${extraMessage ? `<div style="background:#fff7ed;border-left:3px solid #F59E0B;padding:16px;border-radius:0 8px 8px 0;margin-bottom:24px;"><p style="margin:0;color:#92400e;font-size:14px;">${extraMessage}</p></div>` : ''}

    ${itemsHtml ? `<h3 style="margin:0 0 16px;font-size:16px;color:#3d1a2a;font-weight:600;">Order Items</h3><table width="100%">${itemsHtml}</table>` : ''}

    ${
      order.total
        ? `<div style="margin-top:20px;padding:16px;background:#fdf8f3;border-radius:8px;">
        <table width="100%">
          ${order.shippingCharge ? `<tr><td style="font-size:13px;color:#9e7b8a;">Shipping</td><td align="right" style="font-size:13px;color:#9e7b8a;">${order.shippingCharge === 0 ? 'FREE' : '₹' + order.shippingCharge}</td></tr>` : ''}
          <tr><td style="font-size:16px;color:#3d1a2a;font-weight:700;padding-top:8px;border-top:1px solid #e8d5db;">Total</td>
          <td align="right" style="font-size:16px;color:#8B1A4A;font-weight:700;padding-top:8px;border-top:1px solid #e8d5db;">₹${order.total?.toLocaleString('en-IN')}</td></tr>
        </table>
      </div>`
        : ''
    }

    <p style="margin:32px 0 0;font-size:13px;color:#b89aa8;text-align:center;">Track your order at <a href="${process.env.NEXTAUTH_URL}/orders/${order._id}" style="color:#8B1A4A;">silkdrapes.in/orders</a></p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `${cfg.icon} ${cfg.title} — Order #${order.orderNumber} | Silk Drapes`,
    html: baseTemplate(content),
  });
}

export async function sendAdminOrderAlert(order: Partial<IOrder>, customerName: string, customerEmail: string) {
  const content = `
    <h2 style="color:#3d1a2a;margin:0 0 20px;">New Order Received!</h2>
    <p style="color:#9e7b8a;font-size:14px;">A new order has been placed and is awaiting your review.</p>
    
    <div style="background:#fdf8f3;border-radius:12px;padding:20px;margin:20px 0;">
      <p style="margin:0;font-size:18px;color:#8B1A4A;font-weight:700;">#${order.orderNumber}</p>
      <p style="margin:8px 0;font-size:14px;color:#3d1a2a;"><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
      <p style="margin:8px 0;font-size:14px;color:#3d1a2a;"><strong>Amount:</strong> ₹${order.total?.toLocaleString('en-IN')}</p>
      <p style="margin:8px 0;font-size:14px;color:#3d1a2a;"><strong>Payment:</strong> ${order.paymentMethod?.toUpperCase()}</p>
    </div>
    
    <a href="${process.env.NEXTAUTH_URL}/admin/orders" style="display:inline-block;background:#8B1A4A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">View in Admin Panel →</a>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL!,
    subject: `🛍️ New Order #${order.orderNumber} — ₹${order.total?.toLocaleString('en-IN')}`,
    html: baseTemplate(content),
  });
}
