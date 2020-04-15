import React, {Component} from 'react';
import {Form} from 'antd';
import {FormElement} from 'src/library/components';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';

@config({
    ajax: true,
    modal: {
        title: props => props.isEdit ? '修改' : '添加',
    },
})
export default class EditModal extends Component {
    state = {
        loading: false, // 页面加载loading
    };

    componentDidMount() {
        const {isEdit} = this.props;

        if (isEdit) {
            this.fetchData();
        }
    }

    fetchData = () => {
        if (this.state.loading) return;

        const {id} = this.props;

        this.setState({loading: true});
        this.props.ajax.get(`/chart/${id}`)
            .then(res => {
                this.form.setFieldsValue(res);
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const {isEdit} = this.props;
        const successTip = isEdit ? '修改成功！' : '添加成功！';
        const ajaxMethod = isEdit ? this.props.ajax.put : this.props.ajax.post;
        const ajaxUrl = isEdit ? '/chart' : '/chart';

        this.setState({loading: true});
        ajaxMethod(ajaxUrl, values, {successTip})
            .then(() => {
                const {onOk} = this.props;
                onOk && onOk();
            })
            .finally(() => this.setState({loading: false}));
    };

    render() {
        const {isEdit} = this.props;
        const {loading} = this.state;
        const formProps = {
            labelWidth: 100,
        };
        return (
            <ModalContent
                loading={loading}
                okText="保存"
                cancelText="重置"
                onOk={() => this.form.submit()}
                onCancel={() => this.form.resetFields()}
            >
                <Form
                    name="chart-modal-edit"
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                >
                    {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                    <FormElement
                        {...formProps}
                        label="消息标识"
                        name="messageToken"
                        required
                        maxLength={50}
                    />
                    <FormElement
                        {...formProps}
                        type="textarea"
                        label="描述"
                        name="description"
                        maxLength={255}
                    />
                    <FormElement
                        {...formProps}
                        label="图标标题"
                        name="title"
                        maxLength={50}
                    />
                    <FormElement
                        {...formProps}
                        label="纵轴显示标签个数"
                        name="valueTickCount"
                    />
                    <FormElement
                        {...formProps}
                        label="横轴系显示标签个数"
                        name="labelTickCount"
                    />
                    <FormElement
                        {...formProps}
                        label="type"
                        name="type"
                        maxLength={20}
                    />
                </Form>
            </ModalContent>
        );
    }
}