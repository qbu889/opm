<template>
  <div class="excel-to-word">
    <h2>Excel转Word工具</h2>
    <div class="card">
      <div class="card-body">
        <form action="http://localhost:5001/upload" method="post" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="excelFile" class="form-label">选择Excel文件 (.xlsx, .xls)</label>
            <input type="file" class="form-control" id="excelFile" name="excel_file" accept=".xlsx,.xls" required>
          </div>
          <button type="submit" class="btn btn-primary">上传并转换</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExcelToWord'
}
</script>

<style scoped>
.excel-to-word {
  padding: 20px;
}
</style>