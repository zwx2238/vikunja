package routes

import (
	"strings"
	"testing"
	"testing/fstest"
)

func TestHashedCodeCacheControl(t *testing.T) {
	for _, name := range []string{"index-Abc123_-.js", "Home-Cufg8QWL.css", "config.js", "index.html", "sw.js", "manifest.webmanifest"} {
		t.Run(name, func(t *testing.T) {
			files := fstest.MapFS{name: &fstest.MapFile{Data: []byte("fixture")}}
			info, err := files.Stat(name)
			if err != nil {
				t.Fatal(err)
			}
			header, err := getCacheControlHeader(info, strings.NewReader("fixture"))
			if err != nil {
				t.Fatal(err)
			}
			want := cacheControlNone
			if strings.HasPrefix(name, "index-") || strings.HasPrefix(name, "Home-") {
				want = cacheControlMax
			}
			if header != want {
				t.Fatalf("%s: got %q, want %q", name, header, want)
			}
		})
	}
}
