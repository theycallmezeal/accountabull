package main

import (
	"fmt"
	"net/smtp"
	"io/ioutil"
	"log"
)

func getMessage(m *Message, recp Recipient) string {
	subject := fmt.Sprintf("Subject: %s Failed to Complete a Task\n", m.Failer)
	from := "From: \"Accountabull\" <accountabull@sendgrid.tookmund.com>\n"
	to := fmt.Sprintf("To: \"%s\" <%s>\n", recp.Name, recp.Email)
	mime := "MIME-version: 1.0;\nContent-Type: text/plain; charset=\"UTF-8\";\n\n"
	bug := ""
	if m.Phone != "" {
		bug += fmt.Sprintf("Call or Text him: %s\n", m.Phone)
	}
	if m.Facebook != "" {
		bug += fmt.Sprintf("Send him a Facebook Message: %s\n", m.Facebook)
	}
	if m.Twitter != "" {
		bug += fmt.Sprintf("Tweet at him: %s\n", m.Twitter)
	}
	if m.Linkedin != "" {
		bug += fmt.Sprintf("Send him a message on LinkedIn: %s\n", m.Linkedin)
	}
	if m.Email != "" {
		bug += fmt.Sprintf("Send him an email: %s\n", m.Email)
	}
	if bug == "" {
		bug = fmt.Sprintf("%s is a coward and did not want to give us any contact information. But you know them, so go track them down.\n", m.Failer)
	}
	body := fmt.Sprintf("Hi there %s!\nJust wanted to let you know that %s failed to complete \"%s\" by the deadline of %s 🐄.\n%s", recp.Name, m.Failer, m.Task, m.Time, bug)
	return fmt.Sprint(subject, from, to, mime, body)
}

func Email(m *Message) error {
	password, err := ioutil.ReadFile(".sendgrid")
	if err != nil {
		return err
	}
	a := smtp.PlainAuth("", "apikey", string(password[:len(password)-1]), "smtp.sendgrid.net")
	for i := range m.Recipients {
		message := getMessage(m, m.Recipients[i])
		log.Printf("Message: %s", message)
		err = smtp.SendMail("smtp.sendgrid.net:587", a, "apikey", []string{m.Recipients[i].Email}, []byte(message))
		if err != nil {
			return err
		}
	}
	return err
}


