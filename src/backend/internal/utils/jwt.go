package utils

import (
	"log/slog"
	"os"
	"time"

	"openctfbackend/ent"

	"github.com/golang-jwt/jwt"
)

func GetJwtSecret() string {
	jwtSecret := Getenv(
		"JWT_SECRET",
		"8c7fafb856380624fa60b22e7baf311d",
	)
	if jwtSecret == "8c7fafb856380624fa60b22e7baf311d" {
		slog.Warn(
			"using development JWT secret, this should never occur on prod",
			"JWT_SECRET env var", os.Getenv("JWT_SECRET"),
		)
	}
	return jwtSecret
}

func JwtEncode(claims map[string]any, secret string) (string, error) {
	t := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims(claims),
	)
	return t.SignedString([]byte(secret))
}

func JwtVerify(token, secret string) (map[string]any, error) {
	t, err := jwt.Parse(token, func(t *jwt.Token) (any, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	return t.Claims.(jwt.MapClaims), nil
}

func GetToken(user *ent.User) (string, error) {
	jwtSecret := GetJwtSecret()

	return JwtEncode(
		map[string]any{
			"sub":              user.ID,
			"id":               user.ID,
			"iat":              time.Now().Unix(),
			"username":         user.Username,
			"permission_level": user.PermissionLevel,
		},
		jwtSecret,
	)
}
