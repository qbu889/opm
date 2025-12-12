<template>
  <div class="event-cleaner-container">
    <div class="header">
      <h2 class="title">Kafka推送消息体格式化</h2>
      <p class="subtitle">输入FP值和事件时间，生成标准格式的消息体</p>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="form-group">
          <label for="fpValue" class="form-label">FP值</label>
          <textarea
              class="form-textarea"
              id="fpValue"
              v-model="fpValue"
              rows="3"
              placeholder="请输入FP值，每行一个">
          </textarea>
        </div>

        <div class="form-group">
          <label for="eventTime" class="form-label">事件时间</label>
          <input
              type="text"
              class="form-input"
              id="eventTime"
              v-model="eventTime"
              placeholder="支持格式: YYYY/MM/DD HH:MM 或 YYYY-MM-DD HH:MM">
          <div class="time-format-hint">
            支持格式示例: 2020-01-11 22:22, 2020/01/11 22:00
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="cleanEvent" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '处理中...' : '格式化' }}
          </button>
        </div>

        <div v-if="result" class="result-section">
          <div class="result-header">
            <h5 class="result-title">格式化结果：</h5>
            <button
                class="btn btn-copy"
                @click="copyResult"
                :class="{ 'copied': copied }">
              {{ copied ? '已复制!' : '复制结果' }}
            </button>
          </div>
          <div class="result-content">
            <pre class="result-pre">{{ result }}</pre>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'EventCleaner',
  setup() {
    const fpValue = ref('');
    const eventTime = ref('');
    const result = ref(null);
    const error = ref('');
    const loading = ref(false);
    const copied = ref(false);

    // 时间格式化函数
    const formatEventTime = (timeStr) => {
      if (!timeStr.trim()) return '';

      // 支持的格式:
      // 1. YYYY-MM-DD HH:MM
      // 2. YYYY/MM/DD HH:MM
      // 3. YYYY-MM-DD HH：MM (中文冒号)
      // 4. YYYY/MM/DD HH：MM (中文冒号)

      // 替换中文冒号为英文冒号
      let formattedTime = timeStr.replace(/：/g, ':');

      // 统一日期分隔符为横线
      formattedTime = formattedTime.replace(/\//g, '-');

      return formattedTime;
    };

    const cleanEvent = async () => {
      if (!fpValue.value.trim()) {
        error.value = '请输入FP值';
        return;
      }

      try {
        loading.value = true;
        error.value = '';

        // 格式化时间
        const formattedTime = formatEventTime(eventTime.value);

        const response = await axios.post('http://localhost:5001/clean-event', {
          fp_value: fpValue.value,
          event_time: formattedTime
        });
        result.value = JSON.stringify(response.data.result, null, 2);
      } catch (err) {
        error.value = err.response?.data?.error || '处理失败，请检查输入';
      } finally {
        loading.value = false;
      }
    };

    const copyResult = async () => {
      if (!result.value) return;

      try {
        await navigator.clipboard.writeText(result.value);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch (err) {
        // 降级方案：创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = result.value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      }
    };

    return {
      fpValue,
      eventTime,
      result,
      error,
      loading,
      copied,
      cleanEvent,
      copyResult
    };
  }
}
</script>

<style scoped>
.event-cleaner-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
}

.card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
}

.form-textarea,
.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
  height: 80px; /* 添加这一行 */
}

.form-textarea:focus,
.form-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.time-format-hint {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
}

.button-group {
  text-align: center;
  margin: 30px 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #66b1ff;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.result-section {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.result-title {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.btn-copy {
  background: #f0f2f5;
  color: #606266;
  padding: 6px 12px;
  font-size: 12px;
}

.btn-copy:hover:not(:disabled) {
  background: #e1e5eb;
}

.btn-copy.copied {
  background: #67c23a;
  color: white;
}

.result-content {
  padding: 16px;
  background: #fafafa;
  max-height: 400px;
  overflow: auto;
}

.result-pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 13px;
  line-height: 1.5;
  color: #303133;
}

.error-message {
  margin-top: 20px;
  padding: 12px 16px;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  border: 1px solid #fde2e2;
}
</style>
