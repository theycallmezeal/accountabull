package main

import (
	"fmt"
	"net/smtp"
	"io/ioutil"
	"log"
)

func getMessage(m *Message) string {
	subject := fmt.Sprintf("Subject: %s Failed to Complete a Task\n", m.Failer)
	mime := "MIME-version: 1.0;\nContent-Type: text/plain; charset=\"UTF-8\";\n\n"
	bug := ""
	if m.Phone != "" {
		bug += fmt.Sprintf("Call or Text him: %s\r\n", m.Phone)
	}
	if m.Facebook != "" {
		//... and so on
	}
	if bug == "" {
		bug = fmt.Sprintf("%s is a coward and did not want to give us any contact information. But you know them, so go track them down.\r\n", m.Failer)
	}
	body := fmt.Sprintf("%s failed to do %s at %s\n%s", m.Failer, m.Task, m.Time, bug)
	return fmt.Sprint(subject, mime, body)
}

func Email(m *Message) error {
	message := getMessage(m)
	log.Printf("Message: %s", message)
	to := make([]string, len(m.Recipients))
	for i := range m.Recipients {
		to = append(to, fmt.Sprintf("%s <%s>", m.Recipients[i].Name, m.Recipients[i].Email))
		log.Printf("Recipient: %s", to[len(to)-1])
	}

	password, err := ioutil.ReadFile(".sendgrid")
	if err != nil {
		return err
	}
	a := smtp.PlainAuth("", "apikey", string(password), "smtp.sendgrid.net")
	err = smtp.SendMail("smtp.sendgrid.net:587", a, "apikey", to, []byte(message))
	return err
}


