package main

import (
	"html/template"
	"bytes"
	"fmt"
	"time"
)

func getMessage(m *Message, recp Recipient) (*bytes.Buffer, error) {
	buf := new(bytes.Buffer)
	t, err := template.ParseFiles("template.html")
	if err != nil {
		return buf, err
	}
	m.Recipient = recp.Name
	buf.WriteString(fmt.Sprintf("Subject: %s Failed to Complete a Task\n", m.Failer))
	buf.WriteString("From: \"Accountabull\" <accountabull@sendgrid.tookmund.com>\n")
	buf.WriteString(fmt.Sprintf("To: \"%s\" <%s>\n", recp.Name, recp.Email))
	buf.WriteString("MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n")
	err = t.Execute(buf, m)
	return buf, err
}

func ReadableTime(ts string) (string, error) {
	t, err := time.Parse(time.RFC3339, ts)
	if err != nil {
		return "", err
	}
	t = t.Local()
	return t.Format(time.Kitchen), nil
}
