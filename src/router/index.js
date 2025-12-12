import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SqlFormatter from '../views/SqlFormatter.vue';
import ChatPage from '../views/ChatPage.vue';
import DocumentConverter from '../views/DocumentConverter.vue'
import WordToMd from '../views/WordToMd.vue'
import EventCleaner from '../views/EventCleaner.vue'
import MarkdownUpload from '../views/MarkdownUpload.vue'
import ExcelToWord from '../views/ExcelToWord.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/sql-formatter',
        name: 'SqlFormatter',
        component: SqlFormatter
    },
    {
        path: '/document-converter',
        name: 'DocumentConverter',
        component: DocumentConverter
    },
    {
        path: '/chat',
        name: 'ChatPage',
        component: ChatPage
    },
    {
        path: '/word-to-md',
        name: 'WordToMd',
        component: WordToMd
    },
    {
        path: '/event-cleaner',
        name: 'EventCleaner',
        component: EventCleaner
    },
    {
        path: '/markdown-upload',
        name: 'MarkdownUpload',
        component: MarkdownUpload
    },
    {
        path: '/excel-to-word',
        name: 'ExcelToWord',
        component: ExcelToWord
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;