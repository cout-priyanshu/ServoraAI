# 🤖 Servora AI

### Autonomous AI Customer Support. Grounded in Your Business. Available 24/7.

**Servora AI** is an autonomous, ultra-low-latency customer support chatbot built for e-commerce businesses, SaaS platforms, and modern websites.

It answers customer questions strictly using your business-provided knowledge base, including shipping policies, return and refund rules, pricing, and FAQs. When it cannot find a reliable answer, it escalates the query directly to your configured support email instead of making things up.

<p align="center">
  <a href="https://servora-ai-olive.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_LAUNCH_LIVE_DEMO-Visit_Servora_AI-6366f1?style=for-the-badge" alt="Launch Servora AI" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live_on_Vercel-success?style=flat-square" alt="Live on Vercel" />
  <img src="https://img.shields.io/badge/Framework-Next.js-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/AI-Groq_LPU-orange?style=flat-square" alt="Groq AI" />
  <img src="https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
</p>

---

## 🌐 Live Platform

**Start automating your customer support today. No installation required.**

https://github.com/user-attachments/assets/fae74ebc-d1fc-4086-949c-03da99586093



| Resource | Link |
|---|---|
| 🚀 Live Dashboard | [servora-ai-olive.vercel.app](https://servora-ai-olive.vercel.app/) |
| 💻 GitHub Repository | [ServoraAI](https://github.com/cout-priyanshu/ServoraAI) |
| ⚡ Chat API | [api/chat](https://servora-ai-olive.vercel.app/api/chat) |

---

## 💡 Why Servora AI?

Traditional customer support is expensive, repetitive, and difficult to scale. Servora AI transforms your existing business documentation into an intelligent support assistant.

### Key Benefits

| Feature | Description |
|---|---|
| ⚡ Ultra-Low Latency | Target sub-300ms response times powered by Groq LPUs. Actual latency depends on network and processing conditions. |
| 🎯 Grounded AI Responses | Answers are restricted to the business knowledge and policies you provide. |
| 🚫 No Fabricated Policies | Avoids inventing return policies, shipping promises, pricing, or other business information. |
| 📩 Smart Escalation | Unknown or unsupported questions are directed to your configured support email. |
| 🌙 24/7 Autonomous Support | Handles repetitive customer queries without requiring a human agent for every interaction. |
| 🔌 Universal Integration | Embed the chatbot into virtually any website using a single script tag. |
| 🧠 AI-Powered Engine | Combines Groq inference with Google Gemini capabilities. |

### Built for

- **E-commerce:** Shipping, returns, refunds, orders, and product FAQs.
- **SaaS Products:** Subscription policies, features, billing, and onboarding.
- **Agencies:** Service descriptions, pricing, packages, and client FAQs.
- **Business Websites:** General customer inquiries and support automation.

---

## ⚙️ How It Works

Servora AI follows a simple three-step cloud workflow.

### Step 1 — Open Your Dashboard

Visit the live platform:

[https://servora-ai-olive.vercel.app/](https://servora-ai-olive.vercel.app/)

Access your dashboard and configure your business.

### Step 2 — Configure Your Store

Provide the following information:

- **Store Name:** Your business or website name.
- **Support Email:** The email address that receives escalated customer queries.
- **Knowledge Base:** Your business policies, FAQs, shipping details, return rules, pricing, and other relevant information.

Click **Save Changes** to save your configuration.

### Step 3 — Embed Your Chatbot

Copy your unique embed code from the dashboard.

Paste the generated script tag into your website, preferably immediately before the closing `</body>` tag.

That's it. Your website can now display the Servora AI support chatbot.

---

## 🚀 Quickstart: Integration Guide

Integrate Servora AI into your website without installing additional packages or managing AI infrastructure.

### 1. Universal Embed Script

Use the following script format:

```html
<script
  src="https://servora-ai-olive.vercel.app/chatbot.js"
  data-owner-id="YOUR_OWNER_ID"
  defer
></script>
```

**Important:** Replace `YOUR_OWNER_ID` with your actual owner ID generated or provided by your Servora AI dashboard.

### 2. Plain HTML

Add the following code immediately before the closing `</body>` tag.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Store</title>
</head>
<body>

  <h1>Welcome to My Store</h1>
  <p>How can we help you today?</p>

  <!-- Servora AI Chatbot -->
  <script
    src="https://servora-ai-olive.vercel.app/chatbot.js"
    data-owner-id="YOUR_OWNER_ID"
    defer
  ></script>

</body>
</html>
```

### 3. Next.js

Add the chatbot script using the Next.js `Script` component.

```tsx
import Script from "next/script";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Servora AI Chatbot */}
        <Script
          src="https://servora-ai-olive.vercel.app/chatbot.js"
          data-owner-id="YOUR_OWNER_ID"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

Replace `YOUR_OWNER_ID` with your dashboard-generated owner ID.

### 4. React

Add the script to your root application component.

```jsx
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://servora-ai-olive.vercel.app/chatbot.js";
    script.dataset.ownerId = "YOUR_OWNER_ID";
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>Welcome to My Website</h1>
      <p>Powered by Servora AI.</p>
    </div>
  );
}

export default App;
```

### 5. Shopify

Integrate Servora AI directly into your Shopify storefront.

1. Open your Shopify Admin Dashboard.
2. Navigate to **Online Store → Themes**.
3. Select your active theme.
4. Click **Edit Code**.
5. Open `layout/theme.liquid`.
6. Locate the closing `</body>` tag.
7. Paste the following code immediately before it.

```liquid
<!-- Servora AI Customer Support -->
<script
  src="https://servora-ai-olive.vercel.app/chatbot.js"
  data-owner-id="YOUR_OWNER_ID"
  defer
></script>
```

8. Save your changes.

Your Servora AI chatbot is now integrated into your storefront.

---

## 🖥️ Dashboard Features

Servora AI provides a centralized dashboard for managing your customer support automation.

### ⚡ Real-Time AI Test Simulator

Test your business chatbot before deploying it to your website.

- Ask questions based on your configured policies.
- Evaluate how the AI responds to customer queries.
- Test whether unsupported questions are handled appropriately.
- Refine your knowledge base based on test results.

### 📚 Policy Template Blueprints

Get started faster with structured business knowledge templates.

**Available templates:**

| Template | Designed For |
|---|---|
| 🛒 E-commerce | Shipping, returns, refunds, cancellations, and product policies |
| 💻 SaaS | Subscriptions, billing, features, and account-related FAQs |
| 🏢 Agency | Service packages, pricing, project policies, and client FAQs |

Use these blueprints as a starting point and customize them according to your business.

### 🔌 Instant Embed Code Generator

Generate your unique chatbot integration script directly from the dashboard.

- Get your owner-specific embed code.
- Copy the integration snippet.
- Add it to your existing website.
- Deploy without managing chatbot infrastructure.

### 📩 Automated Support Escalation

When the chatbot cannot confidently answer a question using the configured business knowledge, it can escalate the inquiry to your designated support email.

This helps prevent unsupported AI-generated answers from being presented as official business policies.

---

## 🔗 API Reference

### Headless Integration / Custom Applications

Servora AI also exposes a chat API for applications that need to communicate with the chatbot without relying on the standard embedded widget.

**Base URL**

```text
https://servora-ai-olive.vercel.app/api/chat
```

### Endpoint

```http
POST /api/chat
Content-Type: application/json
```

### Sample Request

The following illustrates a proposed request structure. Confirm the exact field names and required payload against the deployed API implementation before using it.

```json
{
  "ownerId": "YOUR_OWNER_ID",
  "message": "What is your return policy?"
}
```

### Sample Response

Illustrative response structure:

```json
{
  "success": true,
  "reply": "Our return policy is based on the information provided by the store."
}
```

### JavaScript Example

```javascript
async function sendMessage(message) {
  const response = await fetch(
    "https://servora-ai-olive.vercel.app/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ownerId: "YOUR_OWNER_ID",
        message
      })
    }
  );

  if (!response.ok) {
    throw new Error("Unable to communicate with Servora AI.");
  }

  return await response.json();
}

// Example usage
sendMessage("What are your shipping policies?")
  .then(data => {
    console.log(data.reply);
  })
  .catch(error => {
    console.error(error);
  });
```

**Note:** The request and response above are documentation examples, not a verified production API contract. Field names, authentication requirements, response structure, and error handling should be confirmed against the live endpoint before implementing a custom integration. Prefer the dashboard-generated embed script for standard website integrations.

---

## 🧠 Technology Stack

Servora AI combines modern web technologies with high-speed AI inference.

| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| Groq LPU | Ultra-fast AI inference |
| Google Gemini | AI model capabilities |
| Vercel | Cloud deployment and hosting |
| JavaScript | Chatbot integration |

---

## 🔒 Responsible AI Approach

Servora AI is designed around business-grounded customer support.

Its core approach emphasizes:

- Using business-provided information as the source of truth.
- Avoiding unsupported claims about business policies.
- Escalating questions when reliable information is unavailable.
- Keeping business-specific configurations separate through owner identification.

**The goal is simple: useful AI support without inventing business answers.**

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, distribute, and build upon this software under the terms of the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Priyanshu Gupta**

- GitHub: [@cout-priyanshu](https://github.com/cout-priyanshu)
- Project: [Servora AI](https://github.com/cout-priyanshu/ServoraAI)
- Live Platform: [servora-ai-olive.vercel.app](https://servora-ai-olive.vercel.app/)

---

<p align="center">
  <strong>Stop answering the same questions. Start automating with Servora AI.</strong>
  <br />
  <br />
  <a href="https://servora-ai-olive.vercel.app/">
    <img src="https://img.shields.io/badge/Get_Started_with_Servora_AI-6366f1?style=for-the-badge" alt="Get Started" />
  </a>
</p>

<p align="center">
  Made with ❤️ for smarter customer support.
</p>
