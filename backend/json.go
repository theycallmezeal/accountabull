package main

import (
	"encoding/json"
)


type Message struct {
	recipients []Recipient
	failer string
	task string
	time string
	phone string
	facebook string
	twitter string
	linkedin string
	email string
}
type Recipient struct {
	name string
	email string
}

func Json2Message(j []byte) (Message, error) {
	var m Message
	err := json.Unmarshal(j, m)
	return m, err
}
