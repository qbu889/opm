<template>
  <div class="event-cleaner">
    <h2>事件数据清洗工具</h2>
    <div class="card">
      <div class="card-body">
        <div class="mb-3">
          <label for="fpValue" class="form-label">FP值</label>
          <textarea class="form-control" id="fpValue" v-model="fpValue" rows="3" placeholder="请输入FP值"></textarea>
        </div>

        <div class="mb-3">
          <label for="eventTime" class="form-label">事件时间</label>
          <input type="text" class="form-control" id="eventTime" v-model="eventTime"
                 placeholder="支持格式: YYYY/MM/DD HH:MM 或 YYYY-MM-DD HH:MM">
        </div>

        <button class="btn btn-primary" @click="cleanEvent">清洗数据</button>

        <div v-if="result" class="mt-3">
          <h5>清洗结果：</h5>
          <pre class="bg-light p-3">{{ result }}</pre>
        </div>

        <div v-if="error" class="mt-3 alert alert-danger">
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

    const cleanEvent = async () => {
      try {
        error.value = '';
        const response = await axios.post('http://localhost:5001/clean-event', {
          fp_value: fpValue.value,
          event_time: eventTime.value
        });
        result.value = JSON.stringify(response.data.result, null, 2);
      } catch (err) {
        error.value = err.response?.data?.error || '处理失败，请检查输入';
      }
    };

    return {
      fpValue,
      eventTime,
      result,
      error,
      cleanEvent
    };
  }
}
</script>

<style scoped>
.event-cleaner {
  padding: 20px;
}
</style>