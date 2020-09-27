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
	log.Print(string(b))
	m, err := Json2Message(b)
	log.Print(m)
	if checkBadRequest(w, err) {
		log.Printf("JSON: %s", err)
		return
	}
	err = Email(m)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Printf("Email: %s", err)
	}
}

func main() {
	http.HandleFunc("/send", sendMessage)
	http.Handle("/", http.FileServer(http.Dir("../frontend")))
	fmt.Print("Listening on 8080...\n")
	log.Fatal(http.ListenAndServe(":8080", logRequest(http.DefaultServeMux)))
}

func logRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s\n", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)
	})
}
