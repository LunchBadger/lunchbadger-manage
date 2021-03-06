import React, {Component, PropTypes} from 'react';
import getPublicEndpointUrl from '../../../utils/getPublicEndpointUrl';
import updatePublicEndpoint from 'actions/CanvasElements/PublicEndpoint/update';
import PublicStore from 'stores/Public';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const Input = LunchBadgerCore.components.Input;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class PublicEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      path: props.entity.path
    };
  }

  update(model) {
    updatePublicEndpoint(this.props.entity.id, model);
  }

  onStoreUpdate() {
    this.setState({path: this.props.entity.path});
  }

  componentDidMount() {
    PublicStore.addChangeListener(this.onStoreUpdate.bind(this));
  }

  componentWillUnmount() {
    PublicStore.removeChangeListener(this.onStoreUpdate.bind(this));
  }

  onPathChange(event) {
    this.setState({path: event.target.value});
  }

  render() {
    const {entity} = this.props;
    const url = getPublicEndpointUrl(entity.id, this.state.path);

    return (
      <CollapsableDetails title="Properties">
        <div className="details-panel__container details-panel__columns">
          <div className="details-panel__fieldset">
            <span className="details-panel__label">Path</span>
            <Input className="details-panel__input"
                   value={entity.path}
                   name="path"
                   handleChange={this.onPathChange.bind(this)}/>
          </div>
          <div className="details-panel__fieldset">
            <span className="details-panel__label">URL</span>
            <a href={url} target="_blank">{url}</a>
          </div>
        </div>
      </CollapsableDetails>
    )
  }
}

export default BaseDetails(PublicEndpointDetails);

