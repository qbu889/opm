<template>
  <div class="markdown-upload-container">
    <h1 class="page-title">Markdown上传转换</h1>

    <!-- 文件上传区域 -->
    <div class="upload-card card">
      <div class="card-body">
        <form
            @submit.prevent="uploadFile"
            enctype="multipart/form-data"
            class="upload-form"
        >
          <div class="input-group">
            <input
                type="file"
                class="form-control"
                id="markdownFile"
                name="markdown_file"
                accept=".md"
                required
                @change="handleFileChange"
            >
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="!selectedFile || uploading"
            >
              {{ uploading ? '上传中...' : '上传并转换' }}
            </button>
          </div>
        </form>

        <div v-if="uploadError" class="alert alert-danger mt-3">
          {{ uploadError }}
        </div>

        <div v-if="downloadUrl" class="mt-3">
          <a
              :href="downloadUrl"
              class="btn btn-success"
              download
          >
            下载转换后的Word文件
          </a>
        </div>
      </div>
    </div>

    <!-- 关键词管理按钮 -->
    <div class="keywords-management-section">
      <button @click="openKeywordsManager" class="btn btn-outline-primary btn-lg">
        关键词管理
      </button>
    </div>

    <!-- 关键词管理模态框 -->
    <div
        class="modal fade"
        id="keywords-manager-modal"
        tabindex="-1"
        aria-labelledby="keywordsManagerModalLabel"
        aria-hidden="true"
        ref="keywordsManagerModal"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">关键词管理</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="closeKeywordsManager"
            ></button>
          </div>
          <div class="modal-body">
            <div class="keywords-manager-container">
              <!-- 操作按钮区域 -->
              <div class="manager-actions mb-4">
                <button @click="loadKeywords" class="btn btn-outline-primary btn-sm me-2">
                  刷新
                </button>
                <button @click="openAddModal('person')" class="btn btn-success btn-sm me-2">
                  添加人工关键词
                </button>
                <button @click="openAddModal('system')" class="btn btn-warning btn-sm">
                  添加系统关键词
                </button>
              </div>

              <!-- 关键词列表区域 -->
              <div class="keyword-list-grid">
                <div class="keyword-column">
                  <h4 class="column-title text-muted">人工操作关键词</h4>
                  <div class="keywords-container">
                    <div
                        v-for="keyword in personKeywords"
                        :key="keyword"
                        class="keyword-item"
                    >
                      <span class="keyword-text">{{ keyword }}</span>
                      <div class="keyword-actions">
                        <button
                            @click="editKeyword('person', keyword)"
                            class="btn btn-edit btn-sm me-2"
                        >
                          编辑
                        </button>
                        <button
                            @click="deleteKeyword('person', keyword)"
                            class="btn btn-delete btn-sm"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <div v-if="personKeywords.length === 0" class="no-keywords">
                      暂无关键词
                    </div>
                  </div>
                </div>

                <div class="keyword-column">
                  <h4 class="column-title text-muted">系统操作关键词</h4>
                  <div class="keywords-container">
                    <div
                        v-for="keyword in systemKeywords"
                        :key="keyword"
                        class="keyword-item"
                    >
                      <span class="keyword-text">{{ keyword }}</span>
                      <div class="keyword-actions">
                        <button
                            @click="editKeyword('system', keyword)"
                            class="btn btn-edit btn-sm me-2"
                        >
                          编辑
                        </button>
                        <button
                            @click="deleteKeyword('system', keyword)"
                            class="btn btn-delete btn-sm"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <div v-if="systemKeywords.length === 0" class="no-keywords">
                      暂无关键词
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
                type="button"
                class="btn btn-secondary"
                @click="closeKeywordsManager"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑关键词模态框 -->
    <div
        class="modal fade"
        id="keyword-modal"
        tabindex="-1"
        aria-labelledby="keywordModalLabel"
        aria-hidden="true"
        ref="keywordModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-title">
              {{ modalMode === 'add' ? '添加关键词' : '编辑关键词' }}
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="keyword-type" v-model="currentType">
            <input type="hidden" id="original-keyword" v-model="originalKeyword">

            <div class="mb-3">
              <label for="keyword-input" class="form-label">关键词:</label>
              <input
                  type="text"
                  id="keyword-input"
                  class="form-control"
                  placeholder="请输入关键词"
                  v-model="currentKeyword"
              >
            </div>

            <div class="mb-3">
              <label for="keyword-comment" class="form-label">备注:</label>
              <textarea
                  id="keyword-comment"
                  class="form-control"
                  rows="3"
                  placeholder="可选备注信息"
                  v-model="keywordComment"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="closeModal"
            >
              取消
            </button>
            <button
                type="button"
                class="btn btn-primary"
                @click="saveKeyword"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export default {
  name: 'MarkdownUpload',
  setup() {
    // 文件上传相关
    const selectedFile = ref(null);
    const uploading = ref(false);
    const uploadError = ref('');
    const downloadUrl = ref('');

    // 关键词管理相关
    const personKeywords = ref([]);
    const systemKeywords = ref([]);
    const keywordModal = ref(null);
    const keywordsManagerModal = ref(null);
    const modalInstance = ref(null);
    const managerModalInstance = ref(null);

    // 模态框状态
    const modalMode = ref('add'); // 'add' or 'edit'
    const currentType = ref('');
    const originalKeyword = ref('');
    const currentKeyword = ref('');
    const keywordComment = ref('');

    // 文件选择处理
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.name.endsWith('.md')) {
        selectedFile.value = file;
        uploadError.value = '';
      } else if (file) {
        uploadError.value = '请选择.md格式的文件';
        event.target.value = '';
        selectedFile.value = null;
      }
    };

    // 文件上传
    const uploadFile = async () => {
      if (!selectedFile.value) return;

      const formData = new FormData();
      formData.append('markdown_file', selectedFile.value);

      try {
        uploading.value = true;
        uploadError.value = '';

        const response = await axios.post(
            'http://localhost:5001/markdown-upload',
            formData,
            {
              responseType: 'blob'
            }
        );

        // 创建下载链接
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = window.URL.createObjectURL(blob);
        downloadUrl.value = url;
      } catch (error) {
        uploadError.value = error.response?.data?.error || '上传失败，请重试';
      } finally {
        uploading.value = false;
      }
    };

    // 加载关键词
    const loadKeywords = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/keywords');
        personKeywords.value = response.data.person_keywords || [];
        systemKeywords.value = response.data.system_keywords || [];
      } catch (error) {
        console.error('加载关键词失败:', error);
      }
    };

    // 打开关键词管理模态框
    const openKeywordsManager = () => {
      if (!managerModalInstance.value) {
        managerModalInstance.value = new bootstrap.Modal(keywordsManagerModal.value);
      }
      managerModalInstance.value.show();
      // 打开时自动加载关键词
      loadKeywords();
    };

    // 关闭关键词管理模态框
    const closeKeywordsManager = () => {
      if (managerModalInstance.value) {
        managerModalInstance.value.hide();
      }
    };

    // 打开添加模态框
    const openAddModal = (type) => {
      modalMode.value = 'add';
      currentType.value = type;
      originalKeyword.value = '';
      currentKeyword.value = '';
      keywordComment.value = '';

      // 先关闭管理模态框
      closeKeywordsManager();

      // 再打开添加/编辑模态框
      setTimeout(() => {
        if (!modalInstance.value) {
          modalInstance.value = new bootstrap.Modal(keywordModal.value);
        }
        modalInstance.value.show();
      }, 100);
    };

    // 编辑关键词
    const editKeyword = (type, keyword) => {
      modalMode.value = 'edit';
      currentType.value = type;
      originalKeyword.value = keyword;
      currentKeyword.value = keyword;
      keywordComment.value = '';

      // 先关闭管理模态框
      closeKeywordsManager();

      // 再打开编辑模态框
      setTimeout(() => {
        if (!modalInstance.value) {
          modalInstance.value = new bootstrap.Modal(keywordModal.value);
        }
        modalInstance.value.show();
      }, 100);
    };

    // 保存关键词
    const saveKeyword = async () => {
      if (!currentKeyword.value.trim()) {
        alert('请输入关键词');
        return;
      }

      try {
        const data = {
          type: currentType.value + '_keywords',
          keyword: currentKeyword.value,
          original: originalKeyword.value
        };

        await axios.post('http://localhost:5001/api/keywords', data);

        // 关闭模态框并刷新关键词列表
        closeModal();
        await loadKeywords();

        // 重新打开管理模态框
        setTimeout(() => {
          openKeywordsManager();
        }, 100);
      } catch (error) {
        alert('保存失败: ' + (error.response?.data?.message || '未知错误'));
      }
    };

    // 删除关键词
    const deleteKeyword = async (type, keyword) => {
      if (!confirm(`确定要删除关键词 "${keyword}" 吗？`)) {
        return;
      }

      try {
        await axios.delete('http://localhost:5001/api/keywords', {
          data: {
            type: type + '_keywords',
            keyword: keyword
          }
        });

        await loadKeywords();
      } catch (error) {
        alert('删除失败: ' + (error.response?.data?.message || '未知错误'));
      }
    };

    // 关闭模态框
    const closeModal = () => {
      if (modalInstance.value) {
        modalInstance.value.hide();
      }
    };

    return {
      // 文件上传相关
      selectedFile,
      uploading,
      uploadError,
      downloadUrl,
      handleFileChange,
      uploadFile,

      // 关键词管理相关
      personKeywords,
      systemKeywords,
      keywordModal,
      keywordsManagerModal,
      modalMode,
      currentType,
      originalKeyword,
      currentKeyword,
      keywordComment,
      loadKeywords,
      openKeywordsManager,
      closeKeywordsManager,
      openAddModal,
      editKeyword,
      saveKeyword,
      deleteKeyword,
      closeModal
    };
  }
};
</script>

<style scoped>
/* 关键词管理弹窗优化 */
.keywords-manager-container {
  padding: 10px;
}

.manager-actions {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 15px;
  padding: 0 5px;
}

.keyword-list-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 10px;
}

@media (max-width: 992px) {
  .keyword-list-grid {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .keyword-list-grid {
    grid-template-columns: 1fr;
  }

  .manager-actions {
    justify-content: center;
  }
}

.column-title {
  margin-bottom: 15px;
  font-size: 1rem;
  text-align: left;
  padding: 0 5px;
  color: #495057;
}

.keywords-container {
  min-height: 150px;
  max-height: none; /* 移除最大高度限制 */
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.keyword-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #dee2e6;
  margin-bottom: 6px;
  border-radius: 4px;
  background-color: white;
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
}

.keyword-item:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.keyword-text {
  flex: 1;
  word-break: break-all;
  padding-right: 8px;
  font-size: 0.95rem;
}

.keyword-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.btn-edit {
  background-color: #17a2b8;
  color: white;
  border: 1px solid #17a2b8;
  padding: 3px 8px;
  font-size: 0.75rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: 1px solid #dc3545;
  padding: 3px 8px;
  font-size: 0.75rem;
}

.no-keywords {
  text-align: center;
  color: #6c757d;
  padding: 30px 10px;
  font-style: italic;
  font-size: 0.9rem;
}

/* 模态框优化 */
.modal-xl {
  max-width: 95%;
}

.modal-content {
  max-height: 90vh;
  overflow: hidden;
}

.modal-body {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

@media (min-width: 992px) {
  .modal-xl {
    max-width: 80%;
  }
}

</style>

