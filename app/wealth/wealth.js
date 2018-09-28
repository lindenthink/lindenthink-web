import './wealth.less'
import 'bootstrap-treeview/dist/bootstrap-treeview.min.css'
import 'bootstrap-treeview/dist/bootstrap-treeview.min'

const tree = [
    {
        text: '编程',
        nodes: [
            {
                text: 'JAVA',
                nodes: [
                    {
                        text: '基础'
                    },
                    {
                        text: '多线程'
                    }
                ]
            },
            {
                text: 'Python'
            }
        ]
    },
    {
        text: '操作系统'
    },
    {
        text: '数据库'
    },
    {
        text: '算法'
    },
    {
        text: '数学'
    }
];

$('#tree').treeview({
    data: tree,
    levels: 5,
    checkedIcon: 'glyphicon glyphicon-stop'
});
