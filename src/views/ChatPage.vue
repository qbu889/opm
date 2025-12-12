<template>
  <div class="container mt-4">
    <div class="chat-container">
      <div class="chat-header">
        <h3>AI智能助手</h3>
      </div>
      <div class="chat-messages p-3" ref="chatMessages">
        <div class="message system-message">
          <p>你好！我是智能助手，有什么可以帮助你的吗？</p>
        </div>
        <div
            class="message user-message"
            v-for="(msg, index) in messages"
            :key="index"
        >
          <p class="message-sender">{{ msg.role === 'user' ? '你' : '助手' }}</p>
          <p class="message-content">{{ msg.content }}</p>
        </div>
        <div class="typing-indicator" v-if="isTyping">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      <div class="chat-input p-3 border-top">
        <div class="input-group">
          <textarea
              class="form-control"
              v-model="userInput"
              placeholder="输入消息..."
              @keydown.enter.prevent="sendMessage"
          ></textarea>
          <button
              class="btn btn-primary"
              @click="sendMessage"
              :disabled="!userInput.trim() || isTyping"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, getCurrentInstance } from 'vue';

export default {
  name: 'ChatPage',
  setup() {
    const { proxy } = getCurrentInstance();
    const messages = ref([]);
    const userInput = ref('');
    const isTyping = ref(false);
    const chatMessages = ref(null);

    // 滚动到底部
    const scrollToBottom = () => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      }
    };

    // 监听消息变化，自动滚动到底部
    watch(messages, scrollToBottom, { deep: true });

    const sendMessage = async () => {
      const message = userInput.value.trim();
      if (!message) return;

      // 添加用户消息
      messages.value.push({ role: 'user', content: message });
      userInput.value = '';
      isTyping.value = true;

      try {
        // 准备对话历史
        const conversationHistory = [
          { role: 'system', content: 'You are a helpful assistant' },
          ...messages.value
        ];

        // 调用API
        const response = await proxy.$api.chat.callDeepSeek(conversationHistory);

        // 添加助手回复
        if (response.choices && response.choices.length > 0) {
          messages.value.push(response.choices[0].message);
        }
      } catch (err) {
        messages.value.push({
          role: 'assistant',
          content: '抱歉，处理请求时发生错误: ' + (err.message || err)
        });
      } finally {
        isTyping.value = false;
      }
    };

    onMounted(scrollToBottom);

    return {
      messages,
      userInput,
      isTyping,
      chatMessages,
      sendMessage
    };
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: 80vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background-color: #4361ee;
  color: white;
  padding: 15px;
  text-align: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: #f8f9fa;
}

.message {
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 80%;
}

.user-message {
  background-color: #e3f2fd;
  margin-left: auto;
}

.system-message, .assistant-message {
  background-color: #ffffff;
  margin-right: auto;
}

.message-sender {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.message-content {
  margin: 0;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input textarea {
  flex: 1;
  resize: none;
  height: 80px;
}

.typing-indicator {
  display: flex;
  gap: 5px;
  padding: 10px 15px;
  margin-right: auto;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #666;
  animation: typing 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>