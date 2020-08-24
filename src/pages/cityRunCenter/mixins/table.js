export default {
	data() {
		return{
			isShow: false,
			newObj:'',
			total:0,  //数据总条数
			offset:0,  //页数
			pageSize:5, //每页条数
			currentPage:1,//当前页数
		}
	},
	watch:{
		newObj(val){
			console.log("val",val)
			this.offset = 0;
			this.currentPage =1;
		}
	},
	methods:{
		onClose(){
			this.isShow = false
		},
		onCurrentChange(page){
			this.currentPage = page
			this.offset = (page-1)*this.pageSize;
			this.onClickNum(this.newObj)
		},
	},
	mounted(){
		console.log("混入")
	}
}