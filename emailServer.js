const nodemailer = require("nodemailer");

const sendInvoiceEmail = async (invoiceData) => {
    try {
        // Log the invoice data to ensure the values are being passed correctly
        console.log("Preparing to send email with invoice data:", invoiceData);

        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // false for TLS
            auth: {
                user: "computeresourcebookingplatform@gmail.com", // sender email address
                pass: "nmvw mcbn buna jago", // sender email password or app-specific password
            },
            tls: {
                rejectUnauthorized: false, // Important to prevent SSL errors
            }
        });

        // Send a test email to check if the email functionality works
        const testMailOptions = {
            from: "computeresourcebookingplatform@gmail.com", // sender address
            to: "mchethana34@gmail.com", // hardcoded recipient email for testing
            subject: "Test Email",
            text: "This is a test email to check if the email functionality works.",
        };

        // Send test email to verify email functionality
        transporter.sendMail(testMailOptions, (error, info) => {
            if (error) {
                console.log("Error sending test email:", error);
                throw new Error("Test email failed.");
            } else {
                console.log("Test email sent: " + info.response);
            }
        });

        // Email content options for invoice email
        const mailOptions = {
            from: "computeresourcebookingplatform@gmail.com", // sender address
            to: "mchethana34@gmail.com", // hardcoded recipient email
            subject: `Invoice for Order ${invoiceData.orderId}`,
            html: `
                <h1>Invoice for Order ${invoiceData.orderId}</h1>
                <p><strong>Amount:</strong> ${invoiceData.amount} ${invoiceData.currency}</p>
                <p><strong>Participant Name:</strong> ${invoiceData.participant_name}</p>
                <p><strong>Start Date:</strong> ${invoiceData.start_date}</p>
                <p><strong>End Date:</strong> ${invoiceData.end_date}</p>
                <p><strong>Quantity:</strong> ${invoiceData.quantity}</p>
            `,
        };

        // Log SMTP details to see if the connection works
        console.log("Attempting to send invoice email...");

        // Send the invoice email
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending invoice email:", error);
                throw new Error("Failed to send invoice email.");
            } else {
                console.log("Invoice email sent: " + info.response);
            }
        });

        console.log("Invoice sent to mchethana34@gmail.com"); // Log success
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send invoice email."); // Throw error if the email fails
    }
};

module.exports = sendInvoiceEmail;
