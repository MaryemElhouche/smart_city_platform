package com.city.mobility.grpc;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * Simple emergency service proto for generating Java gRPC stubs
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.58.0)",
    comments = "Source: emergency.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class EmergencyServiceGrpc {

  private EmergencyServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "com.city.mobility.grpc.EmergencyService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.city.mobility.grpc.GetEmergencyRequest,
      com.city.mobility.grpc.EmergencyResponse> getGetEmergencyMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetEmergency",
      requestType = com.city.mobility.grpc.GetEmergencyRequest.class,
      responseType = com.city.mobility.grpc.EmergencyResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.city.mobility.grpc.GetEmergencyRequest,
      com.city.mobility.grpc.EmergencyResponse> getGetEmergencyMethod() {
    io.grpc.MethodDescriptor<com.city.mobility.grpc.GetEmergencyRequest, com.city.mobility.grpc.EmergencyResponse> getGetEmergencyMethod;
    if ((getGetEmergencyMethod = EmergencyServiceGrpc.getGetEmergencyMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getGetEmergencyMethod = EmergencyServiceGrpc.getGetEmergencyMethod) == null) {
          EmergencyServiceGrpc.getGetEmergencyMethod = getGetEmergencyMethod =
              io.grpc.MethodDescriptor.<com.city.mobility.grpc.GetEmergencyRequest, com.city.mobility.grpc.EmergencyResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetEmergency"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.city.mobility.grpc.GetEmergencyRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.city.mobility.grpc.EmergencyResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("GetEmergency"))
              .build();
        }
      }
    }
    return getGetEmergencyMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.city.mobility.grpc.ListRequest,
      com.city.mobility.grpc.ListResponse> getListEmergenciesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ListEmergencies",
      requestType = com.city.mobility.grpc.ListRequest.class,
      responseType = com.city.mobility.grpc.ListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.city.mobility.grpc.ListRequest,
      com.city.mobility.grpc.ListResponse> getListEmergenciesMethod() {
    io.grpc.MethodDescriptor<com.city.mobility.grpc.ListRequest, com.city.mobility.grpc.ListResponse> getListEmergenciesMethod;
    if ((getListEmergenciesMethod = EmergencyServiceGrpc.getListEmergenciesMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getListEmergenciesMethod = EmergencyServiceGrpc.getListEmergenciesMethod) == null) {
          EmergencyServiceGrpc.getListEmergenciesMethod = getListEmergenciesMethod =
              io.grpc.MethodDescriptor.<com.city.mobility.grpc.ListRequest, com.city.mobility.grpc.ListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ListEmergencies"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.city.mobility.grpc.ListRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.city.mobility.grpc.ListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("ListEmergencies"))
              .build();
        }
      }
    }
    return getListEmergenciesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.city.mobility.grpc.CreateEmergencyRequest,
      com.city.mobility.grpc.EmergencyResponse> getCreateEmergencyMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateEmergency",
      requestType = com.city.mobility.grpc.CreateEmergencyRequest.class,
      responseType = com.city.mobility.grpc.EmergencyResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.city.mobility.grpc.CreateEmergencyRequest,
      com.city.mobility.grpc.EmergencyResponse> getCreateEmergencyMethod() {
    io.grpc.MethodDescriptor<com.city.mobility.grpc.CreateEmergencyRequest, com.city.mobility.grpc.EmergencyResponse> getCreateEmergencyMethod;
    if ((getCreateEmergencyMethod = EmergencyServiceGrpc.getCreateEmergencyMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getCreateEmergencyMethod = EmergencyServiceGrpc.getCreateEmergencyMethod) == null) {
          EmergencyServiceGrpc.getCreateEmergencyMethod = getCreateEmergencyMethod =
              io.grpc.MethodDescriptor.<com.city.mobility.grpc.CreateEmergencyRequest, com.city.mobility.grpc.EmergencyResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateEmergency"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.city.mobility.grpc.CreateEmergencyRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.city.mobility.grpc.EmergencyResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("CreateEmergency"))
              .build();
        }
      }
    }
    return getCreateEmergencyMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static EmergencyServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceStub>() {
        @java.lang.Override
        public EmergencyServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EmergencyServiceStub(channel, callOptions);
        }
      };
    return EmergencyServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static EmergencyServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceBlockingStub>() {
        @java.lang.Override
        public EmergencyServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EmergencyServiceBlockingStub(channel, callOptions);
        }
      };
    return EmergencyServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static EmergencyServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceFutureStub>() {
        @java.lang.Override
        public EmergencyServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EmergencyServiceFutureStub(channel, callOptions);
        }
      };
    return EmergencyServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * Simple emergency service proto for generating Java gRPC stubs
   * </pre>
   */
  public interface AsyncService {

    /**
     * <pre>
     * Get an emergency by id
     * </pre>
     */
    default void getEmergency(com.city.mobility.grpc.GetEmergencyRequest request,
        io.grpc.stub.StreamObserver<com.city.mobility.grpc.EmergencyResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetEmergencyMethod(), responseObserver);
    }

    /**
     * <pre>
     * List emergencies with optional limit
     * </pre>
     */
    default void listEmergencies(com.city.mobility.grpc.ListRequest request,
        io.grpc.stub.StreamObserver<com.city.mobility.grpc.ListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getListEmergenciesMethod(), responseObserver);
    }

    /**
     * <pre>
     * Create a new emergency
     * </pre>
     */
    default void createEmergency(com.city.mobility.grpc.CreateEmergencyRequest request,
        io.grpc.stub.StreamObserver<com.city.mobility.grpc.EmergencyResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateEmergencyMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service EmergencyService.
   * <pre>
   * Simple emergency service proto for generating Java gRPC stubs
   * </pre>
   */
  public static abstract class EmergencyServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return EmergencyServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service EmergencyService.
   * <pre>
   * Simple emergency service proto for generating Java gRPC stubs
   * </pre>
   */
  public static final class EmergencyServiceStub
      extends io.grpc.stub.AbstractAsyncStub<EmergencyServiceStub> {
    private EmergencyServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EmergencyServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EmergencyServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Get an emergency by id
     * </pre>
     */
    public void getEmergency(com.city.mobility.grpc.GetEmergencyRequest request,
        io.grpc.stub.StreamObserver<com.city.mobility.grpc.EmergencyResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetEmergencyMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * List emergencies with optional limit
     * </pre>
     */
    public void listEmergencies(com.city.mobility.grpc.ListRequest request,
        io.grpc.stub.StreamObserver<com.city.mobility.grpc.ListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getListEmergenciesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Create a new emergency
     * </pre>
     */
    public void createEmergency(com.city.mobility.grpc.CreateEmergencyRequest request,
        io.grpc.stub.StreamObserver<com.city.mobility.grpc.EmergencyResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateEmergencyMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service EmergencyService.
   * <pre>
   * Simple emergency service proto for generating Java gRPC stubs
   * </pre>
   */
  public static final class EmergencyServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<EmergencyServiceBlockingStub> {
    private EmergencyServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EmergencyServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EmergencyServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Get an emergency by id
     * </pre>
     */
    public com.city.mobility.grpc.EmergencyResponse getEmergency(com.city.mobility.grpc.GetEmergencyRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetEmergencyMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * List emergencies with optional limit
     * </pre>
     */
    public com.city.mobility.grpc.ListResponse listEmergencies(com.city.mobility.grpc.ListRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getListEmergenciesMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Create a new emergency
     * </pre>
     */
    public com.city.mobility.grpc.EmergencyResponse createEmergency(com.city.mobility.grpc.CreateEmergencyRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateEmergencyMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service EmergencyService.
   * <pre>
   * Simple emergency service proto for generating Java gRPC stubs
   * </pre>
   */
  public static final class EmergencyServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<EmergencyServiceFutureStub> {
    private EmergencyServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EmergencyServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EmergencyServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Get an emergency by id
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.city.mobility.grpc.EmergencyResponse> getEmergency(
        com.city.mobility.grpc.GetEmergencyRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetEmergencyMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * List emergencies with optional limit
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.city.mobility.grpc.ListResponse> listEmergencies(
        com.city.mobility.grpc.ListRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getListEmergenciesMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Create a new emergency
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.city.mobility.grpc.EmergencyResponse> createEmergency(
        com.city.mobility.grpc.CreateEmergencyRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateEmergencyMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_EMERGENCY = 0;
  private static final int METHODID_LIST_EMERGENCIES = 1;
  private static final int METHODID_CREATE_EMERGENCY = 2;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_GET_EMERGENCY:
          serviceImpl.getEmergency((com.city.mobility.grpc.GetEmergencyRequest) request,
              (io.grpc.stub.StreamObserver<com.city.mobility.grpc.EmergencyResponse>) responseObserver);
          break;
        case METHODID_LIST_EMERGENCIES:
          serviceImpl.listEmergencies((com.city.mobility.grpc.ListRequest) request,
              (io.grpc.stub.StreamObserver<com.city.mobility.grpc.ListResponse>) responseObserver);
          break;
        case METHODID_CREATE_EMERGENCY:
          serviceImpl.createEmergency((com.city.mobility.grpc.CreateEmergencyRequest) request,
              (io.grpc.stub.StreamObserver<com.city.mobility.grpc.EmergencyResponse>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getGetEmergencyMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.city.mobility.grpc.GetEmergencyRequest,
              com.city.mobility.grpc.EmergencyResponse>(
                service, METHODID_GET_EMERGENCY)))
        .addMethod(
          getListEmergenciesMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.city.mobility.grpc.ListRequest,
              com.city.mobility.grpc.ListResponse>(
                service, METHODID_LIST_EMERGENCIES)))
        .addMethod(
          getCreateEmergencyMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.city.mobility.grpc.CreateEmergencyRequest,
              com.city.mobility.grpc.EmergencyResponse>(
                service, METHODID_CREATE_EMERGENCY)))
        .build();
  }

  private static abstract class EmergencyServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    EmergencyServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.city.mobility.grpc.Emergency.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("EmergencyService");
    }
  }

  private static final class EmergencyServiceFileDescriptorSupplier
      extends EmergencyServiceBaseDescriptorSupplier {
    EmergencyServiceFileDescriptorSupplier() {}
  }

  private static final class EmergencyServiceMethodDescriptorSupplier
      extends EmergencyServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    EmergencyServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (EmergencyServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new EmergencyServiceFileDescriptorSupplier())
              .addMethod(getGetEmergencyMethod())
              .addMethod(getListEmergenciesMethod())
              .addMethod(getCreateEmergencyMethod())
              .build();
        }
      }
    }
    return result;
  }
}
