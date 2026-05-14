4. Ejemplo resuelto paso a paso
Trazar la línea desde (2, 3) hasta (10, 7).
Paso 1. Identificar los puntos: x₁ = 2,  y₁ = 3,  x₂ = 10,  y₂ = 7
Paso 2. Calcular dx y dy: dx = 10 − 2 = 8
 dy = 7 − 3 = 4
Paso 3. Calcular el número de pasos: pasos = max(|8|, |4|) = 8
Paso 4. Calcular los incrementos: Xinc = 8 / 8 = 1
Yinc = 4 / 8 = 0.5
Paso 5. Generar los puntos: Se comienza en (2, 3) y en cada iteración se suma Xinc a X y Yinc a Y.

Paso	x real	y real	x redondeado	y redondeado	Punto dibujado
0	2.0	3.0	2	3	(2, 3)
1	3.0	3.5	3	4	(3, 4)
2	4.0	4.0	4	4	(4, 4)
3	5.0	4.5	5	5	(5, 5)
4	6.0	5.0	6	5	(6, 5)
5	7.0	5.5	7	6	(7, 6)
6	8.0	6.0	8	6	(8, 6)
7	9.0	6.5	9	7	(9, 7)
8	10.0	7.0	10	7	(10, 7)
