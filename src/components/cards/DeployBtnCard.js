import React from "react";
import {Card, Button, Form, Row, Col, Input, Icon} from "antd";
import PropTypes from "prop-types";
const FormItem = Form.Item;

class DeployBtnCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    // let's see
    this.props.actions.onClickHandler(this.props.form.getFieldsValue());

  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Card title="Deploy Panel">
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <FormItem label={'Question'}>
              {getFieldDecorator('question', {
                rules: [{ required: true, message: 'Please enter a valid question!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Voting question"/>
              )}
            </FormItem>
            <FormItem label={'P'}>
              {getFieldDecorator('p', {
                rules: [{ required: true, message: 'Please input p'}],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type={'number'} placeholder="p?" />
              )}
            </FormItem>
            <FormItem label={'G'}>
              {getFieldDecorator('g', {
                rules: [{ required: true, message: 'Please input g' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type={'number'} placeholder="g?" />
              )}
            </FormItem>
          </Row>
          <Row>
            <Col span={24} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">Search</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}

DeployBtnCard.propTypes = {
  actions: PropTypes.shape({
    onClickHandler: PropTypes.func.isRequired
  })
};

export default Form.create()(DeployBtnCard);
