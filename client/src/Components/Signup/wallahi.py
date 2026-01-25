import numpy as np
import matplotlib.pyplot as plt

def euler_method(f, t0, y0, h, steps):
    """
    f: The function dy/dt
    t0, y0: Initial conditions
    h: Step size
    steps: Number of iterations
    """
    t_values = [t0]
    y_values = [y0]
    
    t = t0
    y = y0
    
    for _ in range(steps):
        
        slope = f(t, y)
        
        
        y = y + h * slope
        
        # Increment t
        t = t + h
        
        t_values.append(t)
        y_values.append(y)
        
    return np.array(t_values), np.array(y_values)


def func(t, y):
    return t + y

t_start, y_start = 0, 1
step_size = 0.1
num_steps = 20

t_pts, y_pts = euler_method(func, t_start, y_start, step_size, num_steps)

plt.plot(t_pts, y_pts, 'bo-', label="Euler's Approximation")
plt.title("Euler's Method Solution")
plt.xlabel("t")
plt.ylabel("y")
plt.grid(True)
plt.legend()
plt.show()