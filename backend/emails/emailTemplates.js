export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Messenger</title>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 10px !important;
        }

        h1 {
          font-size: 22px !important;
        }

        p, li {
          font-size: 16px !important;
        }

        .button {
          padding: 10px 20px !important;
          font-size: 16px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">

    <!-- Preheader Text -->
    <div style="display: none; font-size: 1px; color: #f5f5f5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
      Welcome to Messenger – your messaging hub is ready!
    </div>

    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding: 30px 20px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center;">
                <img src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg?t=st=1741295028~exp=1741298628~hmac=0d076f885d7095f0b5bc8d34136cd6d64749455f8cb5f29a924281bafc11b96c&w=1480" alt="Messenger Logo" width="80" height="80" style="border-radius: 50%; background-color: white; padding: 10px;" />
                <h1 style="color: white; font-size: 26px; font-weight: 600; margin-top: 20px;">Welcome to Messenger!</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 35px; color: #333;">
                <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
                <p>We're thrilled to have you on board! Messenger helps you connect with people instantly and securely.</p>
                
                <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
                  <p style="font-size: 16px; margin: 0 0 15px;"><strong>Here’s how to get started:</strong></p>
                  <ul style="padding-left: 20px; margin: 0;">
                    <li style="margin-bottom: 10px;">Upload your profile picture</li>
                    <li style="margin-bottom: 10px;">Add contacts</li>
                    <li style="margin-bottom: 10px;">Start conversations</li>
                    <li>Share media and more!</li>
                  </ul>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${clientURL}" role="button" style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-weight: 600; font-size: 17px; display: inline-block;">Open Messenger</a>
                </div>

                <p>If you need any help, feel free to reach out. We're always here for you.</p>
                <p>Happy messaging!</p>

                <p style="margin-top: 30px;">Warm regards,<br><strong>The Messenger Team</strong></p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f5f5f5; text-align: center; padding: 20px; font-size: 12px; color: #888;">
                <p style="margin: 0;">© 2025 Messenger. All rights reserved.</p>
                <p style="margin: 8px 0;">
                  <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 8px;">Privacy Policy</a> |
                  <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 8px;">Terms</a> |
                  <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 8px;">Support</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
