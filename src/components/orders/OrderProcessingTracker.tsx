import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { OrderService } from '../../services/orderService';
import { OrderProcessingResponse, ProcessingStep } from '../../types/order';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2,
  CreditCard,
  Package,
  Truck,
  Bell,
  RefreshCw
} from 'lucide-react';

interface OrderProcessingTrackerProps {
  orderId: string;
  autoRefresh?: boolean;
  onProcessingComplete?: (result: OrderProcessingResponse) => void;
}

export function OrderProcessingTracker({ 
  orderId, 
  autoRefresh = false, 
  onProcessingComplete 
}: OrderProcessingTrackerProps) {
  const [processingResult, setProcessingResult] = useState<OrderProcessingResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIcons = {
    1: CreditCard,
    2: Package,
    3: Package,
    4: Truck,
    5: RefreshCw,
    6: Bell,
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await OrderService.processOrder(orderId);
      setProcessingResult(result);
      
      if (result.success) {
        onProcessingComplete?.(result);
      } else {
        setError(result.error?.message || 'Processing failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepStatus = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return { color: 'success', icon: CheckCircle };
      case 'in_progress':
        return { color: 'primary', icon: Loader2 };
      case 'failed':
        return { color: 'error', icon: AlertCircle };
      default:
        return { color: 'default', icon: Clock };
    }
  };

  const getOverallStatus = () => {
    if (!processingResult?.data) return 'Not Started';
    
    const { steps, currentStep, totalSteps } = processingResult.data;
    const failedSteps = steps.filter(s => s.status === 'failed');
    
    if (failedSteps.length > 0) return 'Failed';
    if (currentStep === totalSteps) return 'Completed';
    if (currentStep > 0) return 'In Progress';
    return 'Pending';
  };

  const getProgressPercentage = () => {
    if (!processingResult?.data) return 0;
    
    const { currentStep, totalSteps } = processingResult.data;
    return Math.round((currentStep / totalSteps) * 100);
  };

  useEffect(() => {
    if (autoRefresh && isProcessing) {
      const interval = setInterval(() => {
        // In a real implementation, you might want to poll for updates
        // For now, we'll just simulate the processing
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, isProcessing]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Processing Tracker</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">
                Order ID: {orderId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={getOverallStatus() === 'Completed' ? 'success' : 
                             getOverallStatus() === 'Failed' ? 'error' : 
                             getOverallStatus() === 'In Progress' ? 'primary' : 'default'}>
                {getOverallStatus()}
              </Badge>
              {!isProcessing && !processingResult && (
                <Button onClick={startProcessing}>
                  Start Processing
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {processingResult?.data && (
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-neutral-600 mb-2">
                  <span>Progress</span>
                  <span>{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-700">Current Status:</span>
                  <p className="text-neutral-900">{processingResult.data.currentStatus}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Estimated Delivery:</span>
                  <p className="text-neutral-900">
                    {new Date(processingResult.data.estimatedDeliveryDate).toLocaleDateString()}
                  </p>
                </div>
                {processingResult.data.trackingNumber && (
                  <div>
                    <span className="font-medium text-neutral-700">Tracking Number:</span>
                    <p className="text-neutral-900 font-mono">{processingResult.data.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-error-800">Processing Error</h3>
            <p className="text-sm text-error-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Processing Steps */}
      {processingResult?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingResult.data.steps.map((step, index) => {
                const { color, icon: StatusIcon } = getStepStatus(step);
                const StepIcon = stepIcons[step.stepNumber as keyof typeof stepIcons] || Package;
                
                return (
                  <div key={step.stepNumber} className="flex items-start space-x-4">
                    {/* Step Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-success-100' :
                      step.status === 'in_progress' ? 'bg-primary-100' :
                      step.status === 'failed' ? 'bg-error-100' :
                      'bg-neutral-100'
                    }`}>
                      <StepIcon className={`w-5 h-5 ${
                        step.status === 'completed' ? 'text-success-600' :
                        step.status === 'in_progress' ? 'text-primary-600' :
                        step.status === 'failed' ? 'text-error-600' :
                        'text-neutral-400'
                      }`} />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-neutral-900">
                          {step.stepName}
                        </h3>
                        <Badge variant={color as any} size="sm" className="flex items-center space-x-1">
                          <StatusIcon className={`w-3 h-3 ${step.status === 'in_progress' ? 'animate-spin' : ''}`} />
                          <span>{step.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      
                      {step.details && (
                        <p className="text-sm text-neutral-600 mb-1">{step.details}</p>
                      )}
                      
                      {step.error && (
                        <p className="text-sm text-error-600 mb-1">Error: {step.error}</p>
                      )}
                      
                      {step.timestamp && (
                        <p className="text-xs text-neutral-500">
                          {new Date(step.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < processingResult.data.steps.length - 1 && (
                      <div className="absolute left-5 mt-10 w-0.5 h-8 bg-neutral-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isProcessing && !processingResult && (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Processing Order
            </h3>
            <p className="text-neutral-600">
              Please wait while we process your order through all required steps...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}