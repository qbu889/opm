<script>
import { ref, computed, getCurrentInstance } from 'vue';  // 移除 onMounted

export default {
  name: 'SqlFormatter',
  setup() {
    const { proxy } = getCurrentInstance();  // 添加这行
    const idsText = ref('');
    const formattedResult = ref('');
    const sqlQuery = ref('');
    const errorMessage = ref('');
    const isProcessing = ref(false);

    const idCount = computed(() => {
      return idsText.value.split('\n')
          .map(id => id.trim())
          .filter(id => id).length;
    });

    const formatIds = async () => {
      if (!idsText.value.trim()) {
        errorMessage.value = '请输入ID';
        return;
      }

      try {
        isProcessing.value = true;
        errorMessage.value = '';
        // 使用 proxy.$api 替代 $api
        const response = await proxy.$api.sql.formatIds(idsText.value);

        if (response.success) {
          formattedResult.value = response.formatted_ids;
          sqlQuery.value = response.sql_query;
        } else {
          errorMessage.value = response.error || '格式化失败';
        }
      } catch (err) {
        errorMessage.value = '处理请求时发生错误: ' + (err.message || err);
      } finally {
        isProcessing.value = false;
      }
    };

    const copyToClipboard = () => {
      navigator.clipboard.writeText(formattedResult.value)
          .then(() => {
            alert('已复制到剪贴板');
          })
          .catch(err => {
            console.error('复制失败: ', err);
          });
    };

    return {
      idsText,
      formattedResult,
      sqlQuery,
      errorMessage,
      isProcessing,
      idCount,
      formatIds,
      copyToClipboard
    };
  }
};
</script>