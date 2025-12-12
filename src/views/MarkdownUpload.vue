<template>
  <div class="markdown-upload">
    <h2>Markdown转Word工具</h2>
    <div class="card">
      <div class="card-body">
        <form action="http://localhost:5001/markdown-upload" method="post" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="markdownFile" class="form-label">选择Markdown文件 (.md)</label>
            <input type="file" class="form-control" id="markdownFile" name="markdown_file" accept=".md" required>
          </div>
          <button type="submit" class="btn btn-primary">上传并转换</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarkdownUpload'
}
</script>

<style scoped>
.markdown-upload {
  padding: 20px;
}
</style>