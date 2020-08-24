<template>

	<div class="workBox" v-show="workBox==true">
		<div class="shixuHead">{{handTitle}}<i class="close" @click="showclose"></i></div>
		<template>
             <el-input  placeholder="请输入关键字" class="search"  v-model="search" v-if="isSearch" @input="onInput"></el-input>
			
			<el-table  class="my-class"
			v-loading="loading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0)"
			:data="dataSource"
			style="width: 100%" 
			@selection-change="handleSelectionChange"
			:highlight-current-row="true" 
			:row-style="rowStyle" 
			:header-cell-style="tableHeaderColor">
			
				<!--选择-->
				<el-table-column 
				v-if="hasSelection" 
				type="selection" 
				width="45">
				</el-table-column>
				<!-- 序号 -->
				<el-table-column 
				v-if="hasOrder" 
				type="index" 
				width="55"
				></el-table-column>
				<!-- <template v-for="(column, index) in columns" v-if="column.isShow"> -->
					<template v-for="(column, index) in columns" :data="tables">
					<el-table-column 
					width="80"
					:label="column.label"
					align="center"
					v-if="column.isCustomize">
					  <template slot-scope="scope">
						<!-- <i class="el-icon-star-on" v-if="column.isOterIcon" @click="handleClick(scope.row)"></i> -->
						<template v-if="column.isOterIcon">
							<!-- <i @click="handleClick(scope.row)" class="el-icon-star-on"></i> -->
							<i @click="detailClick(scope.row)" style="margin-right:10px"><img :src="iconImg"> </i>
						</template>
						
						<i class="el-icon-location" v-else @click="handleClick(scope.row)"></i>
					  </template>
					</el-table-column>
					<el-table-column 
					v-else
					header-align="center" 
					align="center"
					:showOverflowTooltip="true"
					:sortable="column.hasSort"
					:key="column.prop" 
					:prop="column.prop" 
					:label="column.label">
					</el-table-column>
				</template>
			</el-table>
		</template>

		<!-- 分页 -->
		 <el-pagination
		  :current-page="currentPage"
		  @current-change="onChange" 
		  :page-size="pageSize"
	      background  layout="total, prev, pager, next"
		  :total="total">
		</el-pagination>
	</div>

</template>

<script>
	export default {
		props: {
			loading: {
				type: Boolean,
				default: false
			},
			isSearch:{
				type: Boolean,
				default: false
			},
			handTitle: {
				type: String,
				default: "标题"
			},
			//是否可以选择
			hasSelection: {
				type: Boolean,
				default: false
			},
			isShow:{
				type: Boolean,
				default: true
			},
			hasOrder: {
				type: Boolean,
				default: false
			},
			// 这是相应的字段展示
			columns: {
				type: Array,
				default: function() {
					return []
				}
			},
			// 这是数据
			dataSource: {
				type: Array,
				default: function() {
					return []
				}

			},
			total:{
				type: Number,
				default: 0
			},
			pageSize:{
				type: Number,
				default: 10
			},
			currentPage:{
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				search:'',
				workBox: true,
				iconImg: require('../../baidumap/assets/images/bdstatus/icon_bg.png')
			}
		},
		methods: {
			//通道感知弹出窗
			rowStyle({
				row,
				rowIndex
			}) {
				if (rowIndex % 2 == 1) {
					return 'color:white;background-color: #122140';
				} else {
					return 'color:white;background-color: #0c1a34';
				}
			},
			//修改table header的背景色
			tableHeaderColor({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (rowIndex === 0) {
					return 'background-color: #102a4f;color: #a1cbf1;font-size: 14px;'
				}
			},
			// 弹出窗关闭
			showclose() {
				this.workBox = false
				this.$emit('showClose')
			},

			handleSelectionChange(val) {
				const selectionArr = [];
				val.forEach(function(el) {
					selectionArr.push(el);
				});
				this.$emit('commitSelection', selectionArr);
			},
			onChange(val){
				console.log("a",val)
				// this.currentPage = val;
				this.$emit("current-change",val)
			},
			handleClick(row){
				this.$emit('onhand-click',row)
			},
			detailClick(row){
				console.log("1111",row)
				this.$emit('ondetail-click',row)
			},
			onInput(){
				this.$emit("on-input",this.search)
			}

		},
		mounted(){
			this.workBox = this.isShow;
		},
		watch:{
			isShow(val){
				this.workBox = val
				this.search = ''
			},
		},


	}
</script>

<style scoped="scoped">
	/* 分页 */
	.el-pagination {
		margin-top: 5px;
		float: right;
	}
	
	.shixuHead{
		width: 100%;
		padding-top: 10px;
		text-indent: 36px;
		color: #00ffff;
		font-size: 20px;
		font-weight: bold;
		position: relative;
	}
	.shixuHead:before{
		display: block;
		content: "";
		width: 5px;
		height: 20px;
		background: #00ffff;
		position: absolute;
		left: 20px;
		bottom: -2px;
	}
	
	
	/deep/ .el-pagination.is-background .btn-prev,
	/deep/ .el-pagination.is-background .btn-next,
	/deep/ .el-pagination.is-background .el-pager li {
		background: #102a4f;
	}

	/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
		background: #409eff;
	}

	/* 通道感知弹出窗 */
	.sectionBody1 {
		position: relative;
	}

	.workBox {
		width: 975px;
		height: 390px;
		position: absolute;
		top: 0;
		right: 15px;
		background: #0c1a34;
		transition: 0.3s;
		border: 1px solid #2d86c4;
		z-index: 999;
		padding: 0 10px;
	}

	.workBox .close {
		float: right;
		width: 30px;
		height: 30px;
		background: url(../../baidumap/assets/images/ic_close.png) no-repeat center;
		background-size: cover;
		transition: all .6s;
	}

	.workBox i:hover {
		transform: rotate(180deg);
		transition: all .6s;
	}


	.workBox.active {
		border: 1px solid #2d86c4;
		width: 100%;
		height: 370px;
	}
	.workBox  /deep/ .search{
		position: absolute;
		top: 5px;
		right: 50px;
		width: 17%;
		height: 30px;
	}
	.workBox  /deep/ .search .el-input__inner{
		height: 30px !important;
		background: transparent;
		border: 1px solid #2d86c4;
	}
	.el-icon-location{
		font-size: 25px;
		color: #50f1e9;
	}

	.my-class /deep/ .el-table__body tr:hover>td {
		background-color: #122140 !important;
	}

	.my-class /deep/ .el-table__body tr.current-row>td {
		background-color: transparent !important;
	}

	.my-class /deep/ .el-table th.gutter {
		display: table-cell !important;
	}

	.my-class,
	.my-class /deep/ th,
	.my-class /deep/ td,
	.my-class /deep/ th.is-leaf {
		border: none;
	}


	.my-class /deep/ .cell {
		line-height: 25px;
		font-size: 18px;
	}
	.my-class /deep/ .cell img{
		width: 25px;
		height: 25px;
	}

	.my-class /deep/ th {
		padding: 15px 0;
	}

	.my-class /deep/ thead tr th {
		padding: 15px 0;
	}
	/deep/ .el-table tr{
		background-color:transparent !important ;
 	}
	/deep/  .el-icon-loading:before{
	   font-size: 40px;
	   color: #ffffff;
   }
  /deep/ .el-loading-spinner .el-loading-text{
	    color: #ffffff;
		font-size: 16px;
   }
	.el-table--enable-row-transition {
		height: 265px;
		overflow-y: auto;
		margin-top: 10px;
	}

	.el-table--group::after,
	.el-table--border::after,
	.el-table::before {
		display: none;
	}

	.el-table {
		height: calc(100% - 87px);
		overflow: auto;
		background: none !important;

	}

	.el-table__row .el-tooltip p:first-child {
		margin-bottom: 5px;
	}
	/deep/ .el-pagination__total{
		color: #fff;
	}
</style>
