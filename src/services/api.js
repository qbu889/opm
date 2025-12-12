import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://localhost:5001', // Flask 后端地址
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
api.interceptors.request.use(
    config => {
        // 可以在这里添加认证信息等
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// 封装所有后端接口
export default {
    // SQL 格式化相关接口
    sql: {
        formatIds(idsText) {
            return api.post('/format_ids', { ids: idsText });
        }
    },

    // 文档处理相关接口
    document: {
        downloadDemoTemplate() {
            return api.get('/download-demo-template', { responseType: 'blob' });
        },
        uploadDemo(formData) {
            return api.post('/upload-demo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        uploadAndConvert(formData) {
            return api.post('/upload-and-convert', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        downloadConvertedDoc() {
            return api.get('/download-converted-doc', { responseType: 'blob' });
        },
        formatCheck(formData) {
            return api.post('/format-check', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
    },

    // 聊天相关接口
    chat: {
        callDeepSeek(messages, model = 'deepseek-chat', stream = false) {
            return api.post('/call-deepseek', { model, messages, stream });
        }
    },

    // Word 转 Markdown 接口
    wordToMd: {
        convert(formData) {
            return api.post('/word-to-md', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob'
            });
        }
    },

    // 事件处理接口
    event: {
        cleanEvent(fpValue, eventTime) {
            return api.post('/clean-event', { fp_value: fpValue, event_time: eventTime });
        }
    },

    // Markdown 上传转换接口
    markdown: {
        uploadAndConvert(formData) {
            return api.post('/markdown-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob'
            });
        }
    },

    // Excel 转 Word 接口
    excel2word: {
        upload(formData) {
            return api.post('/excel2word/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        convert() {
            return api.get('/excel2word/convert');
        },
        verify() {
            return api.get('/excel2word/verify');
        },
        downloadWord() {
            return api.get('/excel2word/download/word', { responseType: 'blob' });
        },
        downloadStats() {
            return api.get('/excel2word/download/stats', { responseType: 'blob' });
        }
    }
};