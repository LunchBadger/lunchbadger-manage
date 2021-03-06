import Pipeline from '../models/Pipeline';
import _ from 'lodash';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Gateways = [];

class Gateway extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'InitializeGateway':
          Gateways.push.apply(Gateways, action.data);
          Gateways = this.sortItems(Gateways);
          this.emitInit();
          break;
        case 'UpdateGatewayOrder':
          _.remove(Gateways, action.entity);
          Gateways.splice(action.hoverOrder, 0, action.entity);
          Gateways = this.sortItems(this.setEntitiesOrder(Gateways));
          this.emitChange();
          break;
        case 'AddGateway':
          Gateways.push(action.gateway);
          action.gateway.itemOrder = Gateways.length - 1;
          this.emitChange();
          break;
        case 'UpdateGateway':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'AddPipeline':
          action.gateway.addPipeline(Pipeline.create({name: action.name}));
          this.emitChange();
          break;
        case 'DeployGateway':
          Gateways.push(action.gateway);
          action.gateway.itemOrder = Gateways.length - 1;
          this.emitChange();
          break;
        case 'DeployGatewaySuccess':
          const gateway = this.findEntityByGateway(action.gateway);

          if (gateway) {
            gateway.ready = true;
            this.emitChange();
          }
          break;
        case 'RemoveEntity':
          _.remove(Gateways, {id: action.entity.id});
          this.emitChange();
          break;
      }
    });
  }

  /**
   * @returns {Gateway[]}
   */
  getData() {
    return Gateways;
  }

  findEntity(id) {
    return _.find(Gateways, {id: id});
  }

  /**
   * @param gateway {Gateway}
   * @returns {Gateway|undefined}
   */
  findEntityByGateway(gateway) {
    const id = gateway.id;

    return this.findEntity(id);
  }

  findEntityByPipelineId(pipelineId) {
    return _.find(Gateways, (gateway) => {
      return !!_.find(gateway.pipelines, {id: pipelineId});
    });
  }
}

export default new Gateway;
