const React = require('react');
const Item = require('./item');
const style = require('./styles/main');

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: 0 };
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);
    this.select = this.select.bind(this);
  }

  onInputChange(event) {
    const input = event.target.value.split(' ');
    const [keyword, query] = input;
    this.props.onInputChange(keyword, query);
  }

  onInputKeyPress(event) {
    let active = this.state.active;
    if (event.keyCode === 13) { // enter
      return this.select(active);
    }
    if (event.keyCode === 38) { // up arrow
      active = Math.max(0, active - 1);
    } else if (event.keyCode === 40) { // down arrow
      active = Math.min(this.props.items.length - 1, active + 1);
    }
    this.setState({ active });
  }

  select(selectedIndex) {
    const selectedObj = this.props.items[selectedIndex];
    if (selectedObj.clipboard) {
      const copy = this.refs.copyField;
      copy.innerText = selectedObj.clipboard;
      copyInnerText(copy);
      copy.innerText = '';
      this.props.toggleVisibility();
    }
    if (selectedObj.link) location.replace(selectedObj.link);
  }

  render() {
    const items = this.props.items.map((item, i) =>
      <Item
        title={item.title} subtitle={item.subtitle} link={item.link} key={i}
        index={i} active={this.state.active} select={this.select}
      />
    );

    return (
      <div style={style.container}>
        <input
          id="omni-chrome-input" type="text" style={style.input} autoFocus
          onChange={this.onInputChange} onKeyDown={this.onInputKeyPress} ref="omniChromeInput"
        />
        { items }
        <div type="hidden" ref="copyField" />
      </div>
    );
  }
}

module.exports = View;


function copyInnerText(element) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
}
