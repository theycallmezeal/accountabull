package main

import (
	"encoding/json"
)

type Message struct {
	Recipients []Recipient `json:"recipients"`
	Failer string `json:"failer"`
	Task string `json:"task"`
	Time string `json:"time"`
	Phone string `json:"phone"`
	Facebook string `json:"facebook"`
	Twitter string `json:"twitter"`
	Linkedin string `json:"linkedin"`
	Email string `json:"email"`
	Recipient string
}
type Recipient struct {
	Name string `json:"name"`
	Email string `json:"email"`
}

func Json2Message(j []byte) (*Message, error) {
	m := new(Message)
	err := json.Unmarshal(j, &m)
	return m, err
}
