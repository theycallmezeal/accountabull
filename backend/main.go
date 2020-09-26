package main

import (
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
)

func checkBadRequest(w http.ResponseWriter, err error) bool {
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return true
	}
	return false
}

func sendMessage(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	if checkBadRequest(w, err) {
		return
	}
	m, err := Json2Message(b)
	if checkBadRequest(w, err) {
		return
	}
	resp, err := Email(m)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
	fmt.Fprint(w, resp)
}

var loads int64
func root(w http.ResponseWriter, r *http.Request) {
	loads++
	fmt.Fprintf(w, "Test %d\n", loads)
}

func main() {
	http.HandleFunc("/send", sendMessage)
	http.HandleFunc("/", root)
	fmt.Print("Listening on 8080...\n")
	log.Fatal(http.ListenAndServe(":8080", logRequest(http.DefaultServeMux)))
}

func logRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s\n", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)
	})
}
