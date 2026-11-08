(function () {
  const api_url = "http://localhost:3000/api/chat";
  const scriptTag = document.currentScript;
  const ownerId = scriptTag ? scriptTag.getAttribute("data-owner-id") : null;

  if (!ownerId) {
    console.error("Servora AI: data-owner-id attribute not found on script tag.");
    return;
  }

  // Inject custom scoped styles for animations, scrollbars, and typing dots
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes servora-fade-up {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes servora-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-4px); opacity: 1; }
    }
    #servora-chat-box {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      animation: servora-fade-up 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #servora-chat-messages::-webkit-scrollbar {
      width: 5px;
    }
    #servora-chat-messages::-webkit-scrollbar-thumb {
      background: #d4d4d8;
      border-radius: 10px;
    }
    .servora-dot {
      width: 6px;
      height: 6px;
      background: #71717a;
      border-radius: 50%;
      display: inline-block;
      animation: servora-bounce 1.2s infinite ease-in-out;
    }
    .servora-dot:nth-child(2) { animation-delay: 0.15s; }
    .servora-dot:nth-child(3) { animation-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  // Floating Launcher Button
  const button = document.createElement("button");
  button.setAttribute("aria-label", "Open Customer Support Chat");
  const chatIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  const closeIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  button.innerHTML = chatIcon;

  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#09090b",
    color: "#ffffff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.28)",
    zIndex: "999999",
    transition: "transform 0.2s ease, background 0.2s ease",
  });

  button.onmouseenter = () => (button.style.transform = "scale(1.06)");
  button.onmouseleave = () => (button.style.transform = "scale(1)");
  document.body.appendChild(button);

  // Chat Window Container
  const box = document.createElement("div");
  box.id = "servora-chat-box";
  Object.assign(box.style, {
    position: "fixed",
    bottom: "92px",
    right: "24px",
    width: "350px",
    maxWidth: "calc(100vw - 48px)",
    height: "480px",
    maxHeight: "calc(100vh - 120px)",
    borderRadius: "20px",
    background: "#ffffff",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08)",
    zIndex: "999999",
  });

  box.innerHTML = `
    <div style="
      background: #09090b;
      color: #ffffff;
      padding: 16px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #27272a;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: #27272a; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
          AI
          <span style="position: absolute; bottom: 0; right: 0; width: 9px; height: 9px; background: #10b981; border-radius: 50%; border: 2px solid #09090b;"></span>
        </div>
        <div>
          <div style="font-size: 14px; font-weight: 600; line-height: 1.2;">Customer Support</div>
          <div style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">Typically replies instantly</div>
        </div>
      </div>
      <button id="servora-chat-close" style="
        background: transparent;
        border: none;
        color: #a1a1aa;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;">
        ✕
      </button>
    </div>

    <div id="servora-chat-messages" style="
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 10px;">
    </div>

    <div style="
      display: flex;
      align-items: center;
      border-top: 1px solid #e4e4e7;
      background: #ffffff;
      padding: 10px 12px;
      gap: 8px;">
      <input id="servora-chat-input" type="text" style="
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #e4e4e7;
        background: #f4f4f5;
        border-radius: 12px;
        font-size: 13px;
        color: #18181b;
        outline: none;
        transition: border-color 0.15s ease, background 0.15s ease;"
        placeholder="Ask a question..." />
      <button id="servora-chat-send" style="
        padding: 10px 14px;
        border: none;
        background: #09090b;
        color: #ffffff;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.15s ease;">
        Send
      </button>
    </div>
  `;

  document.body.appendChild(box);

  const input = box.querySelector("#servora-chat-input");
  const sendBtn = box.querySelector("#servora-chat-send");
  const closeBtn = box.querySelector("#servora-chat-close");
  const messageArea = box.querySelector("#servora-chat-messages");

  // Input focus styling
  input.onfocus = () => {
    input.style.background = "#ffffff";
    input.style.borderColor = "#18181b";
  };
  input.onblur = () => {
    input.style.background = "#f4f4f5";
    input.style.borderColor = "#e4e4e7";
  };

  function toggleChat() {
    const isHidden = box.style.display === "none";
    box.style.display = isHidden ? "flex" : "none";
    button.innerHTML = isHidden ? closeIcon : chatIcon;
    if (isHidden) input.focus();
  }

  button.onclick = toggleChat;
  closeBtn.onclick = toggleChat;

  function addMessage(text, from) {
    const bubble = document.createElement("div");
    bubble.textContent = text;
    Object.assign(bubble.style, {
      maxWidth: "80%",
      padding: "10px 14px",
      borderRadius: "16px",
      fontSize: "13px",
      lineHeight: "1.45",
      wordWrap: "break-word",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      background: from === "user" ? "#09090b" : "#ffffff",
      color: from === "user" ? "#ffffff" : "#18181b",
      border: from === "user" ? "none" : "1px solid #e4e4e7",
      boxShadow: from === "user" ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
      borderBottomRightRadius: from === "user" ? "4px" : "16px",
      borderBottomLeftRadius: from === "user" ? "16px" : "4px",
    });
    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  // Initial welcome greeting
  addMessage("Hi there! How can we help you today?", "ai");

  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5";

    // Typing indicator bubble
    const typing = document.createElement("div");
    typing.innerHTML = `<span class="servora-dot"></span><span class="servora-dot"></span><span class="servora-dot"></span>`;
    Object.assign(typing.style, {
      padding: "10px 14px",
      borderRadius: "16px",
      borderBottomLeftRadius: "4px",
      background: "#ffffff",
      border: "1px solid #e4e4e7",
       display: "flex",
      gap: "4px",
      alignItems: "center",
      alignSelf: "flex-start",
    });
    messageArea.appendChild(typing);
    messageArea.scrollTop = messageArea.scrollHeight;

    try {
      const response = await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId,
          message: text,
        }),
      });

      const data = await response.json();
      if (typing.parentNode) messageArea.removeChild(typing);

      const replyText =
        typeof data === "string"
          ? data
          : data.reply || data.message || "Something went wrong.";

      addMessage(replyText, "ai");
    } catch (error) {
      console.error("Chat error:", error);
      if (typing.parentNode) messageArea.removeChild(typing);
      addMessage("Unable to connect right now. Please try again.", "ai");
    } finally {
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
      input.focus();
    }
  }

  sendBtn.onclick = handleSend;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
})();