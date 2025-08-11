package openctf

import (
	"fmt"
	"net/http"
	"path/filepath"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/tomek7667/goimail/icloud"
)

func (h *Handler) sendConfirmEmail(user *ent.User) error {
	assetsDir := utils.Getenv("ASSETS_DIR", "./assets")
	logoPath := filepath.Join(assetsDir, "email", "openctf-logo.png")
	confirmURL := fmt.Sprintf("%s/confirm?code=%s", utils.Getenv("APP_URL", "https://openctf.cyber-man.pl/"), *user.ConfirmationCode)

	html := fmt.Sprintf(`<!doctype html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Confirm your account</title>
  <style>
    /* Dark-mode aware palette (kept simple for client support) */
    :root { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
      .bg { background:#0b0f10 !important; }
      .card { background:#0f1416 !important; border-color:#1b2224 !important; }
      .text { color:#d7e0e0 !important; }
      .muted { color:#8aa3a3 !important; }
      .cta { background:#00ff9c !important; color:#0b0f10 !important; }
      .divider { border-color:#1b2224 !important; }
    }
    /* Fix for Outlook.com link underlines */
    a { text-decoration:none; }
  </style>
</head>
<body class="bg" style="margin:0; padding:0; background:#0b0f10;">
  <!-- preheader (hidden) -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    Confirm your OpenCTF account to start tracking and competing. 
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px; margin:0 auto;">
    <tr>
      <td style="padding:24px 16px; text-align:center;">
        <img src="cid:openctf-logo.png" alt="OpenCTF" width="107" height="40" style="display:inline-block; border:0; outline:none; text-decoration:none;">
      </td>
    </tr>

    <tr>
      <td style="padding:0 16px 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" class="card" style="width:568px; margin:0 auto; background:#0e1214; border:1px solid #131a1c; border-radius:12px;">
          <tr>
            <td style="padding:28px 28px 24px 28px;">
              <div class="text" style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; color:#d7e0e0;">
                <div style="font-size:14px; letter-spacing:0.3px; color:#00ff9c; margin-bottom:12px;">
                  &gt; account.verify
                </div>

                <h1 style="margin:0 0 8px 0; font-size:22px; line-height:28px; font-weight:800; letter-spacing:0.2px;">Hello %s,</h1>

                <p style="margin:0 0 16px 0; font-size:15px; line-height:22px; color:#c6d3d3;">
                  Welcome to <strong>OpenCTF</strong>. One last step:
                </p>

                <!-- CTA (bulletproof-ish) -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 8px 0;">
                  <tr>
                    <td align="left">
                      <!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" arcsize="8%%" stroke="f" fillcolor="#00ff9c" style="height:44px; v-text-anchor:middle;">
                          <w:anchorlock/>
                          <center style="color:#0b0f10; font-family:Consolas, 'Courier New', monospace; font-size:15px; font-weight:bold;">
                            Confirm Account
                          </center>
                        </v:roundrect>
                      <![endif]-->
                      <!--[if !mso]><!-- -->
                      <a class="cta" href="%s" target="_blank"
                         style="display:inline-block; background:#00ff9c; color:#0b0f10; padding:12px 20px; border-radius:8px; font-weight:800; font-size:15px; line-height:20px;">
                        Confirm Account
                      </a>
                      <!--<![endif]-->
                    </td>
                  </tr>
                </table>

                <p class="muted" style="margin:8px 0 0 0; font-size:12px; line-height:18px; color:#8aa3a3;">
                  If the button doesn’t work, paste this URL into your browser:
                </p>

                <div style="margin:8px 0 16px 0; padding:12px; background:#091113; border:1px solid #131a1c; border-radius:8px; font-size:12px; line-height:18px; word-break:break-all;">
                  <a href="%s" target="_blank" style="color:#80ffd9; text-decoration:underline;">%s</a>
                </div>

                <hr class="divider" style="border:0; border-top:1px solid #131a1c; margin:16px 0 12px 0;">

                <p class="muted" style="margin:0 0 8px 0; font-size:12px; line-height:18px;">
                  Didn’t create an account? You can safely ignore this email.
                </p>

                <p class="muted" style="margin:0; font-size:12px; line-height:18px;">
                  Need help? Reply to this email or visit our docs.
                </p>
              </div>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="width:568px; margin:12px auto 0 auto;">
          <tr>
            <td style="text-align:center; padding:8px 0 24px 0; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:11px; color:#7c8f8f;">
              © 2025 OpenCTF — Stay sharp.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`,
		user.Username,
		confirmURL,
		confirmURL,
		confirmURL,
	)

	opts := &icloud.SendMailOptions{
		EmbeddedImages: []string{
			logoPath,
		},
	}

	return h.MailerClient.SendMail(
		"OpenCTF Confirm E-mail",
		html,
		opts,
		user.Email,
	)
}

// AuthRegister handles user registration.
//
//	@Summary		Register user
//	@Description	Registers a new user and returns a token upon successful registration.
//	@Tags			authentication
//	@Accept			json
//	@Produce		json
//	@Param			body	body		service.RegisterDto	true	"Registration details"
//	@Success		200		{object}	map[string]any		"User and token"
//	@Failure		400		{object}	map[string]any		"Bad request error"
//	@Failure		500		{object}	map[string]any		"Internal server error"
//	@Router			/auth/register [post]
func (h *Handler) AuthRegister(ctx *gin.Context) {
	dto := service.RegisterDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	user, token, err := h.ServiceClient.Register(ctx, &dto)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	err = h.sendConfirmEmail(user)
	if err != nil {
		h.ServiceClient.DeleteUserByUsername(ctx, user.Username)
		err = fmt.Errorf("failed to send confirmation e-mail to '%s': %w", dto.Email, err)
	}
	rest.FailOrReturn(ctx, map[string]any{
		"user":  user,
		"token": *token,
	}, err)
}
