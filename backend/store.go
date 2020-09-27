package main

import (
	"os"
	"io"
	"log"
	"net/http"
	"path/filepath"
)

var storefs http.Handler = http.FileServer(http.Dir("store"))

func storeData(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		storefs.ServeHTTP(w, r)
	} else if r.Method == http.MethodPost {
		f, err := os.Create(filepath.FromSlash("store"+r.URL.Path))
		if err != nil {
			log.Printf("Store error: %s %s", r.URL.Path, err)
			return
		}
		defer f.Close()
		io.Copy(f, r.Body)
	}
}
