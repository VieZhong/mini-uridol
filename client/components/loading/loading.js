Component({
    /**
     * 组件的属性列表
     */
    /**
     * 组件的初始数据
     */
    data: {
        isLoading: true
    },

    /**
     * 组件的方法列表
     */
    methods: {
        loadingFinish:function(){
             setTimeout(()=>{
            console.log(this.data.isLoading);
            this.setData({
                isLoading:false
            });
            console.log(this.data.isLoading);
        },2000)
        }
    },
    ready: function(){
        console.log(this);
       this.loadingFinish();

    }
})