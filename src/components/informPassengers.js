import emailjs from "@emailjs/browser";

const templateParams = {
  name: "James",
  notes: "Check this out!",
};

export default function sendEmail() {
  const req = emailjs
    .send("service_qr8d5vo", "template_wb28ujl", templateParams, {
      publicKey: "nicCnEqcd9ipV9ju4",
    })
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
      },
      (err) => {
        console.log("FAILED...", err);
      }
    );
}
