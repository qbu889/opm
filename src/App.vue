<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="nav-container">
      <div class="nav-wrapper">
        <h1 class="app-title">数据处理工具集</h1>
        <div class="nav-links">
          <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="nav-link"
              active-class="router-link-active"
          >
            {{ link.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 路由视图容器，添加过渡效果 -->
    <div class="view-container">
      <transition name="slide-fade" mode="out-in">
        <router-view :key="$route.fullPath"/>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      navLinks: [
        { to: '/sql-formatter', name: 'SQL工具' },
        { to: '/word-to-md', name: 'Word转Markdown' },
        { to: '/markdown-upload', name: 'Markdown转Word' },
        { to: '/event-cleaner', name: '事件数据清洗' }
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFFFE0 0%, #764ba2 100%);
  padding: 0;
  margin: 0;
}

/* 导航栏样式 */
.nav-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-link.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.nav-link:hover::before {
  left: 100%;
}

/* 视图容器 */
.view-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

/* 路由过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .app-title {
    font-size: 1.3rem;
  }

  .nav-links {
    gap: 10px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .view-container {
    margin: 20px auto;
    padding: 0 15px;
  }
}
</style>
