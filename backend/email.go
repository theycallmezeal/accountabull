package main

import (
	"net/smtp"
	"io/ioutil"
	"log"
)
var password string

func Email(m *Message) error {
	var err error
	if password == "" {
		pass, err := ioutil.ReadFile(".sendgrid")
		password = string(pass[:len(pass)-1])
		if err != nil {
			return err
		}
	}
	a := smtp.PlainAuth("", "apikey", password, "smtp.sendgrid.net")
	m.Time, err = ReadableTime(m.Time)
	if err != nil {
		return err
	}
	for i := range m.Recipients {
		message, err := getMessage(m, m.Recipients[i])
		if err != nil {
			return err
		}
		log.Printf("Message: %s", message)
		err = smtp.SendMail("smtp.sendgrid.net:587", a, "apikey", []string{m.Recipients[i].Email}, message.Bytes())
		if err != nil {
			return err
		}
	}
	return err
}


