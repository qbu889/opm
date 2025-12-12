<template>
  <div class="sql-formatter-container">
    <h1>SQL ID格式化工具</h1>

    <label for="ids-input">请输入ID（每行一个）:</label>
    <textarea
        id="ids-input"
        v-model="idsText"
        placeholder="例如：
FJ-076-20251202-0322
FJ-076-20251202-0323"
        class="sql-input"
    ></textarea>

    <div class="button-group">
      <button
          @click="formatIds"
          :disabled="isProcessing"
          class="format-btn"
      >
        {{ isProcessing ? '格式化中...' : '格式化' }}
      </button>

      <button
          @click="copyToClipboard"
          :disabled="!formattedResult"
          class="copy-btn"
      >
        复制结果
      </button>
    </div>

    <div v-if="errorMessage" class="error-tip">{{ errorMessage }}</div>

    <div v-if="formattedResult" class="result-box">
      <pre>{{ formattedResult }}</pre>
    </div>

    <div v-if="idsText" class="ids-count">ID数量：{{ idCount }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const idsText = ref('');
const formattedResult = ref('');
const errorMessage = ref('');
const isProcessing = ref(false);

const idCount = computed(() => {
  return idsText.value.split('\n').filter(id => id.trim()).length;
});

const formatIds = () => {
  if (!idsText.value.trim()) {
    errorMessage.value = '请输入至少一个ID';
    return;
  }

  try {
    isProcessing.value = true;
    errorMessage.value = '';

    // 按行分割并清理空白字符
    const idsList = idsText.value.split('\n').filter(id => id.trim());

    // 格式化为SQL格式，每行末尾添加逗号（除了最后一行）
    const formattedIds = idsList.map((id, index) => {
      const formattedId = `'${id.trim()}'`;
      // 如果不是最后一行，添加逗号
      return index < idsList.length - 1 ? `${formattedId},` : formattedId;
    });

    formattedResult.value = formattedIds.join('\n');
  } catch (err) {
    errorMessage.value = `格式化失败：${err.message || '未知错误'}`;
  } finally {
    isProcessing.value = false;
  }
};

const copyToClipboard = async () => {
  if (!formattedResult.value) return;

  try {
    await navigator.clipboard.writeText(formattedResult.value);
    // 显示复制成功提示
    const originalText = errorMessage.value;
    errorMessage.value = '复制成功！';
    setTimeout(() => {
      if (errorMessage.value === '复制成功！') {
        errorMessage.value = originalText;
      }
    }, 2000);
  } catch (err) {
    errorMessage.value = '复制失败：请手动复制结果';
  }
};
</script>

<style scoped>
.sql-formatter-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.sql-input {
  width: 100%;
  height: 200px;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.format-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.copy-btn {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.format-btn:disabled,
.copy-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.error-tip {
  color: #f56c6c;
  margin: 10px 0;
}

.result-box {
  background: #f5f5f5;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  position: relative;
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.ids-count {
  margin-top: 10px;
  color: #666;
}
</style>
