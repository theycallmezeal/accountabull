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
	log.Fatal(http.ListenAndServe(":8080", nil))
}
