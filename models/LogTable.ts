import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

// import { OrgType } from '@/libs/constants';

@modelOptions({
  options: { customName: 'LogTable' },
  schemaOptions: {
    timestamps: true
  }
})
class LogChat {
  @prop({type: String})
  public sessionid?: string;

  @prop({type: Number})
  public messagenumber?: string;

  @prop({type: String})
  public message?: string;

  @prop({type: String})
  public promptid?: string;

  @prop({ type: String })
  public actor?: string;

  @prop({ type: String })
  public context?: string;

  @prop({ type: String })
  public timestampid?: string;
}


export const LogTable = getModelForClass(LogChat);