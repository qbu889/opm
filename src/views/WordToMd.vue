<template>
  <div class="word-to-md">
    <h2>Word转Markdown工具</h2>
    <div class="card">
      <div class="card-body">
        <form action="http://localhost:5001/word-to-md" method="post" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="wordFile" class="form-label">选择Word文件 (.docx)</label>
            <input type="file" class="form-control" id="wordFile" name="word_file" accept=".docx" required>
          </div>
          <button type="submit" class="btn btn-primary">上传并转换</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordToMd'
}
</script>

<style scoped>
.word-to-md {
  padding: 20px;
}
</style>