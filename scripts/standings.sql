SELECT
	t.id,
    t.name,
    COUNT(mt.id) as matchesplayed,
	SUM(CASE WHEN mt.result = 'W' THEN 1 ELSE 0	END) AS wins,
	SUM(CASE WHEN mt.result = 'L' THEN 1 ELSE 0	END) AS losses,
	SUM(CASE WHEN mt.result = 'D' THEN 1 ELSE 0	END) AS draws,
    SUM(mt.score) AS goals,
    SUM(mto.score) AS goalsagainst,
    SUM(points) AS points
FROM team t
JOIN matchteam mt ON mt.team = t.id
JOIN matchteam mto ON mto.match = mt.match AND mto.team <> mt.team -- Opponent
JOIN lookupresult lr ON lr.id = mt.result
GROUP BY t.id;
