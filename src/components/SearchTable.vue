<template>
    <!-- <el-card> -->
    <div>
        <el-table class="tb" v-loading="tableLoading" @current-change="handleCurrentChange" :highlight-current-row="option.hightLightCurrentRow"
            :data="table.pageData" :border="true" style="width: 100%;" empty-text="没有数据" :max-height="option.maxHeight"
            :row-style="option.rowStyle">
            <el-table-column v-for="col in option.cols" :key="col.label" :prop="col.prop" :label="col.label"
                :align="col.align" :type="col.type" :header-align="col.headerAlign" :width="col.width"
                :formatter="col.formatter">
                <template v-if="col.hasBtn" #default="scope">
                    <div v-for="btn in col.btns" :key="btn.name" style="display:inline-block;margin:1px 5px">
                        <el-popover v-if="btn.isPicViewPopoverBtn" placement="left" :width="500" trigger="click">
                            <template #reference>
                                <el-button :size="btn.size">{{btn.name}}</el-button>
                            </template>
                            <div style=" height: 300px;overflow-y: auto;padding:15px">
                                <el-badge value="X" v-for="(url,index) in scope.row.picUrls"
                                    style="cursor: pointer;margin:8px 0px;" :key="url"
                                    @click="btn.picDelClick(index,url,scope)">
                                    <el-image :src="url" @click.stop="btn.picClick(index,url,scope)"></el-image>
                                </el-badge>
                            </div>
                        </el-popover>
                        <el-popover v-else-if="btn.isPicUploadPopoverBtn" placement="left" :width="300" trigger="click">
                            <template #reference>
                                <el-button :size="btn.size">{{btn.name}}</el-button>
                            </template>
                            <div style=" height: 200px;overflow-y: auto;">
                                <el-upload
                                    :with-credentials="true" :multiple="true" :on-success="picFileUploadOk"
                                    :data="{'index':scope.$index}"
                                    :action="btn.uploadAction.replace('{planNo}',toB64(scope.row.planNo)).replace('{carNo}',scope.row.carNo)"
                                    list-type="picture">
                                    <el-button type="primary">选择文件上传</el-button>
                                </el-upload>
                            </div>
                        </el-popover>

                        <el-button v-else :size="btn.size" :type="btn.type" v-show="showBtn(scope,btn.getShow)"
                            @click.prevent="btn.func(scope.$index,table.pageData)">{{btn.name}}</el-button>

                    </div>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <el-pagination v-if="!option.hideP" background layout="prev, pager, next,total,jumper,sizes" :page-size="table.pageSize"
            @current-change="pageChange" :total="table.total"
            :page-sizes="[10, 15, 20, 50, 100]" @size-change="handleSizeChange"></el-pagination>
    </div>
    <!-- </el-card>-->
</template>

<script>
    import Util from "@/util.js"

    export default {
        data() {
            let self = this;
            return {
                params: {},
                tableLoading:false,
                table: {
                    pageSize: 10,
                    total: 0,
                    currentPage: 1,
                    height: 1,
                    pageData: []
                },
            };
        },
        props: ["option"],
        created() {},
        mounted() {},
        methods: {
            pageChange(newCurrentPage) {
                this.table.currentPage = newCurrentPage;
                this.search(this.params, false);
            },
            search(srcParams, resetPage = true, showOkMessage = false) {
                let self = this;
                let params = Util.deepCopy(srcParams)
                if (resetPage) {
                    this.resetTable();
                }
                this.params = params;
                let req = {
                    offset: (this.table.currentPage - 1) * this.table.pageSize,
                    pageSize: this.table.pageSize,
                    params: params
                };
                if(this.option.reqEx){
                    req = Object.assign(req,this.option.reqEx);
                }
                this.tableLoading = true;
                let okCb = res => {
                    if (res && res.status == 200) {
                        let cb = (data) => {
                            this.setTableData(data);
                            self.tableLoading = false;
                            if (showOkMessage) {
                                Util.showMessage(self, "查询成功", Util.elMessageType.sec);
                            }
                        };
                        if (self.option.preSetData) {
                            self.option.preSetData(res.data, cb);
                        } else {
                            cb(res.data);
                        }
                    } else {
                        // if(showOkMessage){
                        Util.showMessage(this, "查询失败", Util.elMessageType.error);
                        // }
                    }
                };
                let errCb = err => {
                    Util.showMessage(this, "处理失败 " + err, Util.elMessageType.error);
                    this.tableLoading = false;
                };
                // 处理空字符串参数,改为null
                let keys = Object.keys(req.params);
                keys.forEach(key => {
                    if (req.params[key] == '') {
                        req.params[key] == null;
                    }
                });
                Util.getJsonPost(this.option.url, okCb, errCb, req);
            },
            setTableData(data) {
                this.table.total = data.total
                this.table.pageData = data.tableData;
                this.onDataLoaded(Util.deepCopy(data.tableData));
            },
            resetTable() {
                this.table.pageData = [];
                this.table.total = 1;
                this.table.currentPage = 1;
            },
            exportExcel(params) {
                let okCb = res => {
                    Util.method.exportExcel(this, this.option.exportExcel.filename, this.getExportData(res.data
                        .tableData));
                };
                let errCb = err => {
                    Util.showMessage(this, "处理失败 " + err, Util.elMessageType.error);
                };
                let req = {
                    offset: 0,
                    pageSize: 999999,
                    params: params
                };
                Util.getJsonPost(this.option.url, okCb, errCb, req);
            },
            getExportData(data) {
                let rows = [];
                let headers = [];
                let isAddHeader = false;
                data.forEach(row => {
                    let rowData = [];
                    this.option.cols.forEach(col => {
                        if (col.type != "index" && !col.hasBtn) {
                            if (!isAddHeader) {
                                headers.push(col.label);
                            }
                            rowData.push(col.formatter ? col.formatter(null, null, row[col.prop]) : row[
                                col.prop]);
                        }
                    });
                    rows.push(rowData);
                    isAddHeader = true;
                });
                return {
                    headers: headers,
                    rows: rows
                };
            },
            handleSizeChange(newSize) {
                this.table.pageSize = newSize;
                this.table.currentPage = 1;
                this.search(this.params, false);
            },
            showBtn(scope, getShow) {
                if (scope.$index != -1 && getShow) {
                    return getShow(scope.row);
                }
                return true;
            },
            onDataLoaded(pageData) {
                if (this.option.onDataLoaded) {
                    this.option.onDataLoaded(pageData);
                }
            },
            handleCurrentChange(currentRow, oldCurrentRow) {
                if (this.option.handleCurrentChange) {
                    this.option.handleCurrentChange(currentRow, oldCurrentRow);
                }
            },
            toB64(str) {
                return btoa(str);
            },
            picFileUploadOk(res, file, fileList){
                let params = res.data.split("_");
                this.table.pageData[parseInt(params[0])].picUrls.push(params[1]);
            }
        }
    }
</script>