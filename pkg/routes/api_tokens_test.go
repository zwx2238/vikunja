// Vikunja is a to-do list application to facilitate your life.
// Copyright 2018-present Vikunja and contributors. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v5"
	"github.com/stretchr/testify/assert"
)

func TestPromoteForwardedServiceAuthorization(t *testing.T) {
	t.Run("promotes one bearer value", func(t *testing.T) {
		c := authorizationTestContext(t)
		c.Request().Header.Set(forwardedServiceAuthorizationHeader, "Bearer service-token")

		promoteForwardedServiceAuthorization(c)

		assert.Equal(t, "Bearer service-token", c.Request().Header.Get("Authorization"))
		assert.Empty(t, c.Request().Header.Values(forwardedServiceAuthorizationHeader))
	})

	t.Run("does not override the standard header", func(t *testing.T) {
		c := authorizationTestContext(t)
		c.Request().Header.Set("Authorization", "Bearer standard-token")
		c.Request().Header.Set(forwardedServiceAuthorizationHeader, "Bearer service-token")

		promoteForwardedServiceAuthorization(c)

		assert.Equal(t, "Bearer standard-token", c.Request().Header.Get("Authorization"))
		assert.Empty(t, c.Request().Header.Values(forwardedServiceAuthorizationHeader))
	})

	t.Run("rejects ambiguous or non-bearer values", func(t *testing.T) {
		for _, values := range [][]string{
			{"Basic credentials"},
			{"Bearer first", "Bearer second"},
		} {
			c := authorizationTestContext(t)
			for _, value := range values {
				c.Request().Header.Add(forwardedServiceAuthorizationHeader, value)
			}

			promoteForwardedServiceAuthorization(c)

			assert.Empty(t, c.Request().Header.Get("Authorization"))
			assert.Empty(t, c.Request().Header.Values(forwardedServiceAuthorizationHeader))
		}
	})
}

func authorizationTestContext(t *testing.T) *echo.Context {
	t.Helper()
	e := echo.New()
	request := httptest.NewRequest(http.MethodGet, "/api/v1/user", nil)
	return e.NewContext(request, httptest.NewRecorder())
}
